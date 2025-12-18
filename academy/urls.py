from rest_framework.routers import DefaultRouter
from .api import FormationViewSet

router = DefaultRouter()
router.register('formations', FormationViewSet)

urlpatterns = router.urls
