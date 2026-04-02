# created to manage the routes in school app so project/app be loosly coupled

from django.urls import path
from django.contrib.auth.views import LoginView,LogoutView
from . import views

app_name= "school" # namespace to keep app loosely coupled  (street)

urlpatterns= [
    path('login/',LoginView.as_view(template_name="school/login.html"), name= 'login'), # name to be used as ref. (building),, as_view used for class based views
    path('home/', views.home, name='home'),
    path('profile/', views.profile, name='profile'),
    path('students/', views.student_list, name='student_list'),
    path('students/create/', views.student_create, name='student_create'),
    path('students/<int:pk>/update/', views.student_update, name='student_update'), # <int:pk> => url param(pk => var name passed to view) =>  So visiting /students/7/update/ calls: student_update(req,pk)
    path('students/<int:pk>/delete/', views.student_delete, name='student_delete'),
    path('logout/', LogoutView.as_view(), name='logout'), # no render page bec, after logout => login handled in settings
    path('register/', views.register, name='register'),

    path('subjects/', views.subject_list, name='subject_list'),
    path('subjects/create/', views.subject_create, name='subject_create'),
    path('subjects/<int:pk>/update/', views.subject_update, name='subject_update'),
    path('subjects/<int:pk>/delete/', views.subject_delete, name='subject_delete'),

    path('grades/', views.grade_list, name='grade_list'),
    path('grades/create/', views.grade_create, name='grade_create'),
    path('grades/<int:pk>/update/', views.grade_update, name='grade_update'),
    path('grades/<int:pk>/delete/', views.grade_delete, name='grade_delete'),

    path('contact/', views.contact, name='contact'),

]
# LoginView handles the logic, we only provide the path to the template

# why not static instead of templates folder => css/js/imgs
#

# FLOW:
# URL: school/login 
#     → goes to school's urls.py       ← URL routing system
#     → calls LoginView                 ← view executes
#     → View says "give me login.html"  
#     → Django's TEMPLATE LOADER searches ALL apps ← completely separate system
#     → returns first match it finds
# so i need to template_name="school/login.html" and in app => mkdir -p template school, so django can't confuse with other apps