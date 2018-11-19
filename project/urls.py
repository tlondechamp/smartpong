from django.conf.urls import url
from django.contrib import admin
from rest_framework.routers import DefaultRouter

from project.app import views

router = DefaultRouter(trailing_slash=False)
router.register(r'players', views.PlayerViewSet, basename='player')
router.register(r'games', views.GameViewSet, basename='games')

urlpatterns = router.urls + [
	url(r'^admin/', admin.site.urls),
]
