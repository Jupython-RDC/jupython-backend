import requests
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Certificate, Formation
from .certificates_serializers import CertificateSerializer
import os


def send_n8n_event(event_name, payload):
    url = os.environ.get('N8N_WEBHOOK_URL')
    if not url:
        return False
    try:
        requests.post(url, json={'event': event_name, 'payload': payload}, timeout=5)
        return True
    except Exception:
        return False


class SubmitCertificateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # expected: formation_id, certificate_url
        formation_id = request.data.get('formation_id')
        certificate_url = request.data.get('certificate_url')
        if not formation_id or not certificate_url:
            return Response({'error': 'formation_id et certificate_url requis'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            formation = Formation.objects.get(id=formation_id)
        except Formation.DoesNotExist:
            return Response({'error': 'Formation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        cert = Certificate.objects.create(user=request.user, formation=formation, certificate_url=certificate_url)

        # try basic verification: HTTP GET to URL -> 200 => mark verified
        try:
            r = requests.get(certificate_url, timeout=5)
            if r.status_code == 200:
                cert.verified = True
                cert.verified_at = timezone.now()
                cert.save()
                send_n8n_event('certificate_verified', {'certificate_id': cert.id, 'user_id': request.user.id, 'formation_id': formation.id})
        except Exception:
            # leave unverified; n8n can pick up and verify asynchronously
            send_n8n_event('certificate_submitted', {'certificate_id': cert.id, 'user_id': request.user.id, 'formation_id': formation.id})

        serializer = CertificateSerializer(cert)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MyCertificatesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        certs = Certificate.objects.filter(user=request.user)
        serializer = CertificateSerializer(certs, many=True)
        return Response(serializer.data)
