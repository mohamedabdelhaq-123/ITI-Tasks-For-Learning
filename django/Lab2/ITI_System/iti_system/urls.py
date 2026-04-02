"""
URL configuration for iti_system project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path,include
from django.conf import settings 
from django.conf.urls.static import static 

urlpatterns = [
    path('admin/', admin.site.urls),  # built in admin panel
    path('school/',include("school.urls")),
    path('api/', include('school.api_urls')),
]

# Browser visits: http://127.0.0.1:8000/students/create/
#   ↓
# school_project/urls.py — the MASTER router
# looks through urlpatterns one by one...
# finds: path('students/', include('students.urls'))  # redirect any URL starting with "school/" to school's app urls.pyf file
# strips 'students/' from the URL → remaining: 'create/'
#   ↓ forwards remaining URL to
# students/urls.py — the APP router
# looks through urlpatterns...
# finds: path('create/', views.student_create, name='create')
#   ↓
# calls student_create(request) in students/views.py



# for dev. only tell django how to find imgs
if settings.DEBUG: 
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)