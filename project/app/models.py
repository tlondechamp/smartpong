from django.db import models

class CreatedAtMixin(models.Model):
    class Meta:
        abstract = True

    created_at = models.DateTimeField(auto_now_add=True)


class Player(CreatedAtMixin, models.Model):
    class Meta:
        ordering = ['-email']

    email = models.EmailField(blank=False)
    name = models.CharField(blank=False, max_length=255)
    elo_rating = models.FloatField()

    def __str__(self):
        return self.name


class Match(CreatedAtMixin, models.Model):
    class Meta:
        ordering = ['-created_at']

    player1 = models.ForeignKey(Player, models.CASCADE, related_name='match_as_player1')
    player2 = models.ForeignKey(Player, models.CASCADE, related_name='match_as_player2')
    score_player1 = models.IntegerField()
    score_player2 = models.IntegerField()

    def __str__(self):
        return '{} {}-{} {}'.format(
            self.player1, self.score_player1, self.score_player2, self.player2)
