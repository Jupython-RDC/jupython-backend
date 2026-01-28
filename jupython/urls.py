"""
URL configuration for jupython project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render
from django.template import TemplateDoesNotExist
from django.http import Http404
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/accounts/', include('accounts.urls')),
    path('api/', include('academy.urls')),
    path('api/enrollments/', include('academy.enrollments_urls')),
    path('api/ranking/', include('ranking.urls')),
    # Token endpoints (alternate access)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Serve the frontend index at project root
    path('', TemplateView.as_view(template_name='index.html')),
]

# During development serve static assets from the frontend assets folder
urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR / 'frontend' / 'frontend' / 'assets')


def _render_frontend_template(request, template_path):
    """Render an HTML template from the frontend folder if it exists, else 404.

    This allows serving files like /about.html or /academy/login.html using
    the templates located in frontend/frontend/.
    """
    # security: prevent directory traversal
    if '..' in template_path or template_path.startswith('/'):
        raise Http404()

    try:
        return render(request, template_path)
    except TemplateDoesNotExist:
        raise Http404()


# Serve direct HTML files from the frontend folder (only .html).
# Keep these patterns after API routes to avoid interfering with them.
urlpatterns += [
    re_path(r'^(?P<template_path>.+\.html)$', _render_frontend_template),
]
 
