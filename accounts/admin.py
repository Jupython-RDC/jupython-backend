from django.contrib import admin
from .models import User

# Register the custom User model so it appears in the Django admin
admin.site.register(User)
