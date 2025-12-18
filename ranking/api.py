from rest_framework.views import APIView
from rest_framework.response import Response
from .services import compute_ranking


class RankingAPIView(APIView):
    def get(self, request):
        return Response(compute_ranking())
