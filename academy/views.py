from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Academy

@api_view(['GET'])
def academy_list(request):
    data = list(Academy.objects.values())
    return Response(data)
