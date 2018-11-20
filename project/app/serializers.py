import json

from django.db.models import Prefetch

from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from project.app.models import Game, GameResult, Player, PlayerResults, Season


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'


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
        for results in PlayerResults.objects.filter(season=season).select_related(
                'player').prefetch_related(
                    Prefetch('player__games_as_player1',
                             queryset=Game.objects.filter(season=season)),
                    Prefetch('player__games_as_player2',
                             queryset=Game.objects.filter(season=season))).order_by('-elo_rating'):

            total = 0
            wins = 0
            draws = 0
            losses = 0
            for game in results.player.games_as_player1.all():
                total += 1
                if game.result in [GameResult.Result_20, GameResult.Result_21]:
                    wins += 1
                else:
                    losses += 1
            for game in results.player.games_as_player2.all():
                total += 1
                if game.result in [GameResult.Result_02, GameResult.Result_12]:
                    wins += 1
                else:
                    losses += 1
            data = {
                'name': results.player.name,
                'rating': results.elo_rating,
                'games': total,
                'wins': wins,
                'draws': draws,
                'losses': losses,
                'win_percentage': round(100 * wins / float(total), 1)
            }
            if total >= season.placement_games:
                next_rank += 1
                if not current_elo or results.elo_rating != current_elo:
                    current_rank = next_rank
                    current_elo = results.elo_rating
                data['rank'] = current_rank
                response['ranking'].append(data)
            elif total > 0:
                response['placement'].append(data)

        return response


class GameSerializer(serializers.ModelSerializer):
    player1 = PrimaryKeyRelatedField(queryset=Player.objects.all())
    player2 = PrimaryKeyRelatedField(queryset=Player.objects.all())
    player1_details = PlayerSerializer(source='player1', read_only=True)
    player2_details = PlayerSerializer(source='player2', read_only=True)

    class Meta:
        model = Game
        fields = '__all__'
        read_only_fields = ('season', 'phase', 'player1_rating_change', 'player2_rating_change')

    def validate(self, data):
        if data['player1'] == data['player2']:
            raise serializers.ValidationError('Both players must be distinct !')
        return data
