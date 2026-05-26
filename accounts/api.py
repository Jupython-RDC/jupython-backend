from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserProfile
from .serializers import RegisterSerializer, UserProfileSerializer
from .permissions import IsOwnerOrReadOnly


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()  # Le signal create_or_update_user_profile crée automatiquement le profil
        return Response({"message": "Utilisateur créé"})


class UserProfileDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]


class MyProfileAPIView(generics.RetrieveUpdateAPIView):
    """Retrieve or update the profile of the currently authenticated user."""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile
