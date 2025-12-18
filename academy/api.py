from rest_framework.viewsets import ModelViewSet
from .models import Formation
from .serializers import FormationSerializer


class FormationViewSet(ModelViewSet):
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer
