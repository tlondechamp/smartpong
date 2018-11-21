from django.conf.urls import url
from django.contrib import admin
from rest_framework.routers import DefaultRouter

from project.app import views

router = DefaultRouter()
router.register(r'api/players', views.PlayerViewSet, basename='player')
router.register(r'api/games', views.GameViewSet, basename='game')
router.register(r'api/seasons', views.SeasonViewSet, basename='season')

urlpatterns = router.urls + [
	url(r'^admin/', admin.site.urls),
]
