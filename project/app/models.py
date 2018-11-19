from __future__ import unicode_literals

from django.db import models
from django.db.models.signals import post_save
from django.utils import timezone

from project.app.elo import Elo


class GameResult(object):
    Result_20 = 0
    Result_21 = 1
    Result_12 = 2
    Result_02 = 3

    choices = (
        (Result_20, '2-0'),
        (Result_21, '2-1'),
        (Result_02, '0-2'),
        (Result_12, '1-2'),
    )


class GamePhase(object):
    Ranked = 0
    Playoffs = 1

    choices = (
        (Ranked, 'Ranked'),
        (Playoffs, 'Playoffs'),
    )


class Player(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, db_index=True)
    email = models.EmailField(max_length=255, db_index=True)

    def __str__(self):
        return self.name


class Season(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    start_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)
    placement_games = models.IntegerField(default=5)
    playoff_data = models.TextField()

    def __str__(self):
        return self.name

    @classmethod
    def get_current_season(cls):
        now = timezone.now()
        return cls.objects.filter(
            ~(models.Q(start_date__gt=now) | models.Q(end_date__lte=now))
        ).order_by('id').first()


class PlayerResults(models.Model):
    player = models.ForeignKey(Player, related_name='season_results', on_delete=models.CASCADE)
    season = models.ForeignKey(Season, related_name='player_results', on_delete=models.CASCADE)
    elo_rating = models.IntegerField(default=1000, db_index=True)
    min_rating = models.IntegerField(null=True)
    max_rating = models.IntegerField(null=True)

    class Meta:
        unique_together = (('season', 'player'),)


class Game(models.Model):
    id = models.AutoField(primary_key=True)
    season = models.ForeignKey(Season, related_name='games', null=True, on_delete=models.CASCADE)
    phase = models.IntegerField(choices=GamePhase.choices, default=GamePhase.Ranked)
    player1 = models.ForeignKey(
        Player, related_name='games_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(
        Player, related_name='games_as_player2', on_delete=models.CASCADE)
    result = models.IntegerField(choices=GameResult.choices)
    player1_rating_change = models.IntegerField(null=True, blank=True)
    player2_rating_change = models.IntegerField(null=True, blank=True)
    date = models.DateTimeField(db_index=True)

    def update_player_ratings(self):
        if self.season and self.phase == GamePhase.Ranked:
            p1_score, p2_score = self._get_player_scores()
            p1_results, dummy = self.season.player_results.get_or_create(player=self.player1)
            p2_results, dummy = self.season.player_results.get_or_create(player=self.player2)
            self.player1_rating_change = self._update_player_rating(
                p1_results, p1_score, p1_results.elo_rating, p2_results.elo_rating)
            self.player2_rating_change = self._update_player_rating(
                p2_results, p2_score, p2_results.elo_rating, p1_results.elo_rating)
            self.save()

    def _update_player_rating(self, result, score, old_rating, opponent_rating):
        new_rating = Elo.get_new_rating(score, old_rating, opponent_rating)
        result.elo_rating = new_rating

        ranked_games = Game.objects.filter(season=result.season, phase=GamePhase.Ranked)

        if ranked_games.filter(
                    models.Q(player1=result.player)|models.Q(player2=result.player)
                ).count() >= result.season.placement_games:
            result.min_rating = (min(result.min_rating, new_rating) if
                result.min_rating is not None else new_rating)
            result.max_rating = (max(result.max_rating, new_rating) if
                result.max_rating is not None else new_rating)

        result.save()
        return new_rating - old_rating

    def _get_player_scores(self):
        if self.result == GameResult.Result_20:
            return (1, 0)
        if self.result == GameResult.Result_21:
            return (0.67, 0.33)
        if self.result == GameResult.Result_12:
            return (0.33, 0.67)
        if self.result == GameResult.Result_02:
            return (0, 1)
        raise RuntimeError('Invalid result value: %s' % self.result)


def game_post_save(sender, instance, created, **kwargs):
    if created:
        instance.update_player_ratings()
post_save.connect(game_post_save, Game)
