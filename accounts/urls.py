from django.urls import path
from .api import RegisterAPIView, UserProfileDetailAPIView, MyProfileAPIView

urlpatterns = [
	path('register/', RegisterAPIView.as_view()),
	path('profile/me/', MyProfileAPIView.as_view()),
	path('profile/<int:pk>/', UserProfileDetailAPIView.as_view()),
]
