from rest_framework.routers import DefaultRouter
from .api import FormationViewSet

router = DefaultRouter()
router.register('formations', FormationViewSet)

urlpatterns = router.urls

# Certificates endpoints
from django.urls import path
from .certificates_api import SubmitCertificateAPIView, MyCertificatesAPIView

urlpatterns += [
	path('certificates/submit/', SubmitCertificateAPIView.as_view()),
	path('certificates/my/', MyCertificatesAPIView.as_view()),
]
