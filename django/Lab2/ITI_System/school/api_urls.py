from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    student_list, student_detail,
    SubjectListView, SubjectDetailView,
    GradeViewSet,
    register, login, logout
)

router = DefaultRouter()
router.register('grades', GradeViewSet, basename='grade')

urlpatterns = [
    
    path('students/', student_list, name='api-student-list'),
    path('students/<int:pk>/', student_detail, name='api-student-detail'),
    
    path('subjects/', SubjectListView.as_view(), name='api-subject-list'),
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='api-subject-detail'),
    
    path('auth/register/', register, name='api-register'),
    path('auth/login/', login, name='api-login'),
    path('auth/logout/', logout, name='api-logout'),
    
    path('', include(router.urls)),
]
