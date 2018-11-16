from rest_framework.serializers import ModelSerializer

from project.app.models import Match, Player


class PlayerSerializer(ModelSerializer):
    class Meta:
        model = Player
        fields = ('email', 'name', 'elo_rating', 'created_at')


class MatchSerializer(ModelSerializer):
    player1 = PlayerSerializer()
    player2 = PlayerSerializer()

    class Meta:
        model = Match
        fields = ('player1', 'player2', 'score_player1', 'score_player2', 'created_at')
