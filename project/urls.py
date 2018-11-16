from django.urls import include, re_path

from project.app import views

urlpatterns = [
    re_path(r'^matches/', views.MatchViewSet.as_view({'get': 'list'}), name='matches'),
    re_path(r'^players/', views.PlayerViewSet.as_view({'get': 'list'}), name='players'),
]
