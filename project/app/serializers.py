import json

from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from project.app.models import Game, Player, Round, Season


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player


class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = ('result', 'player1', 'player2')

class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = ('id', 'name', 'start_date', 'end_date', 'placement_games', 'playoff_data')

    playoff_data = serializers.SerializerMethodField()

    def get_playoff_data(self, season):
        if season.playoff_data:
            return json.loads(season.playoff_data)
        return None


class GameSerializer(serializers.ModelSerializer):
    player1 = PrimaryKeyRelatedField(queryset=Player.objects.all())
    player2 = PrimaryKeyRelatedField(queryset=Player.objects.all())
    player1_details = PlayerSerializer(source='player1', read_only=True)
    player2_details = PlayerSerializer(source='player2', read_only=True)
    rounds = RoundSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        read_only_fields = ('season', 'phase', 'player1_rating_change', 'player2_rating_change')