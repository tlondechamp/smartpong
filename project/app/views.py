from django.db import transaction
from rest_framework.decorators import detail_route
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.viewsets import GenericViewSet, ReadOnlyModelViewSet

from project.app.models import Game, GamePhase, Player, Season
from project.app.serializers import GameSerializer, PlayerSerializer, SeasonSerializer


class CreateListRetrieveViewSet(mixins.CreateModelMixin,
                                mixins.ListModelMixin,
                                mixins.RetrieveModelMixin,
                                GenericViewSet):
    pass


class SeasonViewSet(ReadOnlyModelViewSet):
    queryset = Season.objects.all()
    serializer_class = SeasonSerializer


class GameViewSet(CreateListRetrieveViewSet):
    queryset = Game.objects.all().order_by('-date')
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        season = Season.get_current_season()
        serializer.validated_data['season'] = season
        serializer.validated_data['phase'] = GamePhase.Ranked
        return super(GameViewSet, self).perform_create(serializer)


class PlayerViewSet(ReadOnlyModelViewSet):
    queryset = Player.objects.all().order_by('name')
    serializer_class = PlayerSerializer