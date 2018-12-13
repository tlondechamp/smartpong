from collections import defaultdict
from operator import itemgetter
import json

from django.db.models import Prefetch

from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from project.app.models import Game, GameResult, Player, PlayerResults, Season


PLAYER1_WIN = [
    GameResult.Result_20,
    GameResult.Result_21,
    GameResult.Result_30,
    GameResult.Result_31,
    GameResult.Result_32,
]
PLAYER2_WIN = [
    GameResult.Result_02,
    GameResult.Result_12,
    GameResult.Result_03,
    GameResult.Result_13,
    GameResult.Result_23,
]


def get_percentage(wins, total_games):
    if total_games == 0:
        return 'N/A'
    return round(100 * wins / float(total_games), 1)


def get_opponent(opponents, player):
    return opponents.setdefault(player.id, defaultdict(int, {
        'id': player.id,
        'name': player.name,
        'games': 0,
        'wins': 0,
        'losses': 0,
    }))


def get_data_from_player_result(result):
    total_games = 0
    wins = 0
    losses = 0
    last_games = []
    form = []
    opponents = {}

    for game in result.player.games_as_player1.filter(season=result.season):
        total_games += 1
        opponent = get_opponent(opponents, game.player2)
        opponent['games'] += 1
        last_games.append((game.date, game))
        if game.result in PLAYER1_WIN:
            wins += 1
            form.append((game.date, 'W'))
            opponent['wins'] += 1
        else:
            losses += 1
            form.append((game.date, 'L'))
            opponent['losses'] += 1

    for game in result.player.games_as_player2.filter(season=result.season):
        total_games += 1
        opponent = get_opponent(opponents, game.player1)
        opponent['games'] += 1
        last_games.append((game.date, game))
        if game.result in PLAYER2_WIN:
            wins += 1
            form.append((game.date, 'W'))
            opponent['wins'] += 1
        else:
            losses += 1
            form.append((game.date, 'L'))
            opponent['losses'] += 1

    last_games = sorted(last_games, reverse=True)
    last_games = [GameSerializer(game[1]).data for game in last_games]
    form = sorted(form)
    form = [result[1] for result in form]

    opponents = sorted(opponents.values(), key=itemgetter('wins'), reverse=True)
    for opponent in opponents:
        opponent['win_percentage'] = get_percentage(opponent['wins'], opponent['games'])

    data = {
        'id': result.player.id,
        'name': result.player.name,
        'rating': result.elo_rating,
        'min_rating': result.min_rating,
        'max_rating': result.max_rating,
        'form': form[-5:],
        'opponents': opponents,
        'last_games': last_games[:10],
        'games': total_games,
        'losses': losses,
        'win_percentage': get_percentage(wins, total_games),
        'wins': wins,
    }
    return data, total_games


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

    stats = serializers.SerializerMethodField()

    def get_stats(self, player):
        response = {
            'global': {
                'games': 0,
                'wins': 0,
                'losses': 0,
                'min_rating': 1000,
                'max_rating': 1000,
            },
            'seasons': {}
        }
        for result in player.season_results.prefetch_related(
                    Prefetch(
                        'player__games_as_player1', queryset=Game.objects.filter(player1=player)),
                    Prefetch(
                        'player__games_as_player2', queryset=Game.objects.filter(player2=player))
                ).all():
            data, total_games = get_data_from_player_result(result)

            response['seasons'][result.season.id] = data
            response['global']['min_rating'] = min(
                response['global']['min_rating'],
                response['seasons'][result.season.id]['min_rating']
            )
            response['global']['max_rating'] = max(
                response['global']['max_rating'],
                response['seasons'][result.season.id]['max_rating']
            )
            response['global']['games'] += total_games
            response['global']['wins'] += response['seasons'][result.season.id]['wins']
            response['global']['losses'] += response['seasons'][result.season.id]['losses']
        response['global']['win_percentage'] = get_percentage(
            response['global']['wins'], response['global']['games'])

        return response


class SimplePlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('id', 'name', 'email')


class SeasonSerializer(serializers.ModelSerializer):
    playoff_data = serializers.SerializerMethodField()
    ranking = serializers.SerializerMethodField()

    class Meta:
        model = Season
        fields = ('id', 'name', 'start_date', 'end_date',
                  'placement_games', 'playoff_data', 'ranking')

    def get_playoff_data(self, season):
        if season.playoff_data:
            return json.loads(season.playoff_data)
        return None

    def get_ranking(self, season):
        response = {
            'ranking': [],
            'placement': [],
        }

        current_rank = 0
        next_rank = 0
        current_elo = None
        for result in PlayerResults.objects.filter(season=season).select_related(
                'player').prefetch_related(
                    Prefetch('player__games_as_player1',
                             queryset=Game.objects.filter(season=season)),
                    Prefetch('player__games_as_player2',
                             queryset=Game.objects.filter(season=season))).order_by('-elo_rating'):
            data, total_games = get_data_from_player_result(result)
            if total_games >= season.placement_games:
                next_rank += 1
                if not current_elo or result.elo_rating != current_elo:
                    current_rank = next_rank
                    current_elo = result.elo_rating
                data['rank'] = current_rank
                response['ranking'].append(data)
            elif total_games > 0:
                response['placement'].append(data)

        return response


class GameSerializer(serializers.ModelSerializer):
    player1 = PrimaryKeyRelatedField(queryset=Player.objects.all())
    player2 = PrimaryKeyRelatedField(queryset=Player.objects.all())
    player1_details = SimplePlayerSerializer(source='player1', read_only=True)
    player2_details = SimplePlayerSerializer(source='player2', read_only=True)

    class Meta:
        model = Game
        fields = '__all__'
        read_only_fields = ('season', 'phase', 'player1_rating_change', 'player2_rating_change')

    def validate(self, data):
        if data['player1'] == data['player2']:
            raise serializers.ValidationError('Both players must be distinct !')
        return data
