from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer

from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Utilisateur créé"})


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

