from django.conf.urls import url
from django.contrib import admin
from rest_framework.routers import DefaultRouter

from project.app import views

router = DefaultRouter()
router.register(r'players', views.PlayerViewSet, basename='player')
router.register(r'games', views.GameViewSet, basename='game')
router.register(r'seasons', views.SeasonViewSet, basename='season')

urlpatterns = router.urls + [
	url(r'^admin/', admin.site.urls),
]
