from __future__ import division


class Elo(object):
    R = 400
    K = 20

    @classmethod
    def get_new_rating(cls, score, rating, opponent_rating):
        prob = cls.get_win_probability(rating, opponent_rating)
        return int(round(rating + K * (score - prob)))

    @classmethod
    def get_win_probability(cls, rating, opponent_rating):
        exp = (opponent_rating - rating) / cls.R
        return 1 / (1 + 10 ** exp)
