from django.db import models
from django.contrib.auth.models import AbstractUser
# Create our models here.

class User(AbstractUser):
    university = models.CharField(max_length=255, blank=True)
    def __str__(self):
        return self.username