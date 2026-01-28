from django.contrib import admin
from .models import Academy
# Register your models here.

admin.site.register(Academy)
from .models import Formation, Enrollment, Certificate

admin.site.register(Formation)
admin.site.register(Enrollment)
admin.site.register(Certificate)