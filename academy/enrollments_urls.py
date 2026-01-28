from django.urls import path
from .enrollments_api import EnrollAPIView, MyEnrollmentsAPIView

urlpatterns = [
    path('enroll/', EnrollAPIView.as_view()),
    path('my/', MyEnrollmentsAPIView.as_view()),
]
