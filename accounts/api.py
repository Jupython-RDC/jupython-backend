from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer

from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework import status

# Simple JWT tokens
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # create JWT tokens for the new user so frontend is logged in immediately
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        user_data = UserSerializer(user).data

        return Response({
            "message": "Utilisateur créé",
            "user": user_data,
            "access": access_token,
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

