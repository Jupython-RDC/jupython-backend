from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Formation, Enrollment


class EnrollAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        formation_id = request.data.get('formation_id') or request.data.get('formation')
        if not formation_id:
            return Response({'error': 'formation_id manquant'}, status=400)

        try:
            formation = Formation.objects.get(id=formation_id)
        except Formation.DoesNotExist:
            return Response({'error': 'Formation non trouvée'}, status=404)

        enrollment, created = Enrollment.objects.get_or_create(user=request.user, formation=formation)
        return Response({'enrolled': created, 'formation_id': formation.id})


class MyEnrollmentsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user).select_related('formation')
        data = [
            {
                'id': e.id,
                'formation': {
                    'id': e.formation.id,
                    'title': e.formation.title,
                    'platform': e.formation.platform,
                    'link': e.formation.link,
                },
                'date_joined': e.date_joined,
            }
            for e in enrollments
        ]
        return Response(data)
