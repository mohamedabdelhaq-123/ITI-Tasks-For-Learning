from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Sum

from .models import Student, Subject, Grade
from .serializers import (
    StudentSerializer, SubjectSerializer, GradeSerializer,
    RegisterSerializer, LoginSerializer
)

# fbv more (code & flexibilty)
# cbv med.
# viewset less(code & flexibilty)
###################################### FBV for Students


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) # auth in header
@authentication_classes([TokenAuthentication])
def student_list(request):
    if request.method == 'GET':
        students = Student.objects.all()
        min_grade = request.query_params.get('min_grade')
        if min_grade is not None: # get highest 
            students = students.annotate(total=Sum('grade__grade')).filter(total__gte=min_grade)
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def student_detail(request, pk):
    try:
        student = Student.objects.get(pk=pk)
    except Student.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PATCH':
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


##################################### CBVs for Subjects


class SubjectListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request): # if you got here so you are known & allowed to use the endpoint
        subjects = Subject.objects.all()
        search = request.query_params.get('search')
        if search:
            subjects = subjects.filter(name__icontains=search)
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class SubjectDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self, pk):
        try:
            return Subject.objects.get(pk=pk)
        except Subject.DoesNotExist:
            return None
    
    def get(self, request, pk):
        subject = self.get_object(pk)
        if subject is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = SubjectSerializer(subject)
        return Response(serializer.data)
    
    def put(self, request, pk):
        subject = self.get_object(pk)
        if subject is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        subject = self.get_object(pk)
        if subject is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = SubjectSerializer(subject, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        subject = self.get_object(pk)
        if subject is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        subject.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


############################### ModelViewSet for Grades

# inherit from modelviewset => all crud possible operations

class GradeViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer # serializer for all operations

    def get_queryset(self):
        queryset = super().get_queryset()
        student_id = self.request.query_params.get('student_id')
        subject_id = self.request.query_params.get('subject_id')
        
        if student_id:
            queryset = queryset.filter(student__id=student_id)
        if subject_id:
            queryset = queryset.filter(subject__id=subject_id)
            
        return queryset

# GET /api/grades/?student_id=3
#     ↓
# get_queryset() called
#     ↓
# super() → Grade.objects.all() (all grades)
#     ↓
# student_id = '3' found in URL
#     ↓
# filter(student__id=3) → only student 3's grades
#     ↓
# subject_id = None → skip subject filter
#     ↓
# return filtered queryset
#     ↓
# ModelViewSet serializes → returns JSON

#################################### auth views


@api_view(['POST']) # 3- METHOD => decorator (func => django rest frame. api view), that accept only post req.
@permission_classes([AllowAny]) # 2-ALLOWED? allow access to endpoint by anyone 
@authentication_classes([]) #  1-YOU? ctrl how user prove identity (token,basic,session)
def register(request):
    serializer = RegisterSerializer(data=request.data) # JSON form client to py obj.
    if serializer.is_valid(): # validate obj. (validations)
        username = serializer.validated_data['username']
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        if User.objects.filter(username=username).exists(): # check username eixstance 
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            #new user
        user = User.objects.create_user(username=username, email=email, password=password)
        token, created = Token.objects.get_or_create(user=user) # token and if new token=> true else old false
        
        return Response({
            'token': token.key,
            'user': {'id': user.id, 'username': user.username, 'email': user.email}
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'username': user.username}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# token auth way => my responsibility not like session auth
@api_view(['POST'])
@permission_classes([IsAuthenticated]) # must be allowed to acces this end point
@authentication_classes([TokenAuthentication]) # way of provment the token way
def logout(request):
    request.user.auth_token.delete() #  security wise=> it's why after logout and login again create new token
                                #  what if the hacker took the token after logout => big issue
    return Response({'success': 'Logged out successfully'}, status=status.HTTP_200_OK)
