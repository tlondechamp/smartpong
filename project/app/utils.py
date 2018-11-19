from django import template

from project.app.models import GameResult


register = template.Library()


@register.filter
def win_percentage(player):
    match_total = 0
    win_total = 0
    for game in player.games_as_first_player.all():
        match_total += 1
        if game.result in [GameResult.Result_20, GameResult.Result_21]:
            win_total += 1
    for game in player.games_as_second_player.all():
        match_total += 1
        if game.result in [GameResult.Result_02, GameResult.Result_12]:
            win_total += 1

    if match_total == 0:
        return '-'
    return int(round(100 * win_total / float(match_total)))
