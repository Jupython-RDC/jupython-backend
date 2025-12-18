from django.urls import path
from .api import RegisterAPIView

urlpatterns = [
	path('register/', RegisterAPIView.as_view()),
]
