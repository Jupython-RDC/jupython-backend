from django.urls import path
from .api import RankingAPIView

urlpatterns = [
    path('', RankingAPIView.as_view()),
]
