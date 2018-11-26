from django.db import transaction
from django_filters import FilterSet

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


class SeasonFilter(FilterSet):
    class Meta:
        model = Season
        fields = {
            'name': ['exact', 'icontains'],
            'start_date': ['gt', 'gte', 'lt', 'lte'],
            'end_date': ['gt', 'gte', 'lt', 'lte'],
        }


class SeasonViewSet(ReadOnlyModelViewSet):
    queryset = Season.objects.all().order_by('-start_date')
    serializer_class = SeasonSerializer
    filter_class = SeasonFilter


class GameFilter(FilterSet):
    class Meta:
        model = Game
        fields = {
            'season': ['exact', 'isnull'],
            'phase': ['exact'],
            'date': ['gt', 'gte', 'lt', 'lte'],
        }


class GameViewSet(CreateListRetrieveViewSet):
    queryset = Game.objects.all().order_by('-date')
    serializer_class = GameSerializer
    filter_class = GameFilter

    def perform_create(self, serializer):
        season = Season.get_current_season()
        serializer.validated_data['season'] = season
        serializer.validated_data['phase'] = GamePhase.Ranked
        return super(GameViewSet, self).perform_create(serializer)


class PlayerFilter(FilterSet):
    class Meta:
        model = Player
        fields = {
            'name': ['exact', 'icontains'],
        }


class PlayerViewSet(ReadOnlyModelViewSet):
    queryset = Player.objects.all().order_by('name')
    serializer_class = PlayerSerializer
    filter_class = PlayerFilter
