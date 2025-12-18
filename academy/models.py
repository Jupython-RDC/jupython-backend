from django.db import models
from django.conf import settings

# Use the configured user model (as a string via settings.AUTH_USER_MODEL)
User = settings.AUTH_USER_MODEL


class Academy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    platform = models.CharField(max_length=100)
    link = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# Additional models to align with the reference backend
class Formation(models.Model):
    title = models.CharField(max_length=200)
    platform = models.CharField(max_length=100)
    link = models.URLField()
    is_free = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    formation = models.ForeignKey(Formation, on_delete=models.CASCADE)
    date_joined = models.DateTimeField(auto_now_add=True)

