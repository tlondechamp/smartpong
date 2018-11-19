from django.contrib import admin

from project.app.models import Game, Player, Round, Season

admin.site.register(Game)
admin.site.register(Player)
admin.site.register(Round)
admin.site.register(Season)
