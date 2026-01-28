from django.urls import path
from .api import RegisterAPIView, ProfileAPIView
from rest_framework_simplejwt.views import (
	TokenObtainPairView,
	TokenRefreshView,
)

urlpatterns = [
	path('register/', RegisterAPIView.as_view()),
	path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('profile/', ProfileAPIView.as_view(), name='profile'),
]
