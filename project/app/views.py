from rest_framework import viewsets
from project.app.models import Player, Match
from project.app.serializers import PlayerSerializer, MatchSerializer


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all().order_by('name')
    serializer_class = PlayerSerializer


class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all().order_by('-created_at')
    serializer_class = MatchSerializer
