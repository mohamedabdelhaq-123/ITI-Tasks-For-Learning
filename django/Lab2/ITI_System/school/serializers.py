from rest_framework import serializers
from .models import Student, Subject, Grade, Contact

class StudentSerializer(serializers.ModelSerializer): # read each model field
    class Meta:
        model = Student
        fields = ['id', 'name', 'age', 'email', 'img']
        read_only_fields = ['id']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']
        read_only_fields = ['id']

class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'student', 'student_name', 'subject', 'subject_name', 'grade']
        read_only_fields = ['id', 'student_name', 'subject_name']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'email', 'message', 'date']
        read_only_fields = ['id', 'date']

class RegisterSerializer(serializers.Serializer): # plain Serializer:define every field manually with its type
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True) # writeonly=true field doesn't go out in any response


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
