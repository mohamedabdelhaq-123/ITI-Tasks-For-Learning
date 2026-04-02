from django.contrib import admin
from .models import Student

# Register your models here.
admin.site.register(Student)  # now Student appears at /admin/
