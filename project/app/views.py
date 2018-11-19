from django.db import transaction
from rest_framework.decorators import detail_route
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.viewsets import GenericViewSet

from project.app.models import Game, GamePhase, Player, Season
from project.app.serializers import GameSerializer, PlayerSerializer, RoundSerializer


class CreateListRetrieveViewSet(mixins.CreateModelMixin,
                                mixins.ListModelMixin,
                                mixins.RetrieveModelMixin,
                                GenericViewSet):
    pass


class GameViewSet(CreateListRetrieveViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        season = Season.get_current_season()
        serializer.validated_data['season'] = season
        serializer.validated_data['phase'] = GamePhase.Ranked
        return super(GameViewSet, self).perform_create(serializer)

    @detail_route(methods=['post'])
    def rounds(self, request, pk=None):
        game = self.get_object()
        if len(game.rounds.all()):
            return Response({'error': 'Rounds have already been submited.'},
                            status=HTTP_400_BAD_REQUEST)

        if not isinstance(request.data, list):
            return Response({'error': 'List expected.'},
                            status=HTTP_400_BAD_REQUEST)

        serializers = []
        for item in request.data:
            serializer = RoundSerializer(data=item)
            if not serializer.is_valid():
                return Response(serializer.errors,
                                status=HTTP_400_BAD_REQUEST)
            serializers.append(serializer)

        with transaction.atomic():
            for order, serializer in enumerate(serializers):
                serializer.save(game=game, order=order)
        return Response({'status': 'OK'})


class PlayerViewSet(CreateListRetrieveViewSet):
    queryset = Player.objects.all().order_by('name')
    serializer_class = PlayerSerializer