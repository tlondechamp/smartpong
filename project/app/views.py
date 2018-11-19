from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response

from project.app.models import Player, Game
from project.app.serializers import PlayerSerializer, GameSerializer


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all().order_by('email')
    serializer_class = PlayerSerializer

    def list(self, request):
        serializer = PlayerSerializer(self.queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        player = get_object_or_404(self.queryset, pk=pk)
        serializer = PlayerSerializer(player)
        return Response(serializer.data)


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all().order_by('-created_at')
    serializer_class = GameSerializer

    def list(self, request):
        serializer = GameSerializer(self.queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        game = get_object_or_404(self.queryset, pk=pk)
        serializer = GameSerializer(game)
        return Response(serializer.data)
