from django.contrib import admin

from project.app.models import Game, Player, Season

admin.site.register(Game)
admin.site.register(Player)
admin.site.register(Season)
