from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import google.oauth2.id_token
import google.auth.transport.requests


User = get_user_model()


class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        id_token = request.data.get('id_token')
        if not id_token:
            return Response({'error': 'id_token requis'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            request_adapter = google.auth.transport.requests.Request()
            id_info = google.oauth2.id_token.verify_oauth2_token(id_token, request_adapter)
        except Exception as e:
            return Response({'error': 'Token Google invalide', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # id_info contains email and sub (google user id)
        email = id_info.get('email')
        if not email:
            return Response({'error': 'Email Google manquant'}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(username=email, defaults={'email': email})

        # create tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
