from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.db.models import Sum
from school.models import Student, Subject, Grade, Contact
from school.forms import StudentForm, SubjectForm, GradeForm, ContactForm


# Create your views here.

# View is a normal py function take req. => do logic (queries,business logic, pass data to temp.) => ret. res. (render html)
# views is a brain for each page

# @login_required is a Decorator — 
# it wraps around the view function  
# checks the session before function runs. 
# If no session cookie exists (user not is logged in)
#       it redirects to LOGIN_URL we already set in settings.py
# else run function


# render(request, 'home.html', {'name': 'Ahmed'})
#   ↓
# Django finds templates/home.html
#   ↓
# home.html says: {% extends 'base.html' %}
#   ↓
# Django combines base.html + home.html into one complete HTML document
#   ↓
# Replaces all {{ name }} with "Ahmed"
#   ↓
# Returns the final HTML string to the browser



@login_required # decorator above func. bec it is interpreted lang.
def home(req):
    # render home.html
    return render(req, 'school/home.html')

@login_required
def profile(req):
    return render(req,'school/profile.html')


#############################   Students    ###############
@login_required
def student_list(req):
    return render(req,'school/student_list.html',{"students": Student.objects.all()})

@login_required
def student_create(req):
    if req.method == "POST":  # form was submitted
        form=StudentForm(req.POST, req.FILES)  # fill form with submitted data
        if form.is_valid():
            form.save()     # validate & save => Modelform
            return redirect('school:student_list') # PRG pattern (post/redirct/get) => without redirect may submint agian after refresh and make duplicates
        else:
            return render(req,'school/student_create.html',{"form":form})
    else:
        form = StudentForm() # show empty form
        return render(req,'school/student_create.html',{"form":form})


@login_required
def student_update(req,pk):
    student= get_object_or_404(Student,pk= pk)
    if req.method == "POST": # logically patch but patch & delete don't exist in browser forms
        form=StudentForm(req.POST, req.FILES, instance=student) # use instance bec tell django to update specific records
        if form.is_valid():
            form.save()     # validate & save => Modelform
            return redirect('school:student_list') # PRG pattern (post/redirct/get) => without redirect may submint agian after refresh and make duplicates
    else:
        form = StudentForm(instance=student) # show existing student data
    return render(req,'school/student_update.html',{"form":form})


@login_required
def student_delete(req, pk):
    student = get_object_or_404(Student,pk=pk)
    if req.method == "POST":
        student.delete()
        return redirect('school:student_list')
    return render(req,'school/student_confirm_delete.html', {"student": student})


#############################   Subjects    ###############


# django's ORM uses __ to add lookup types to field queries.



@login_required
def subject_list(req):
    query = req.GET.get('q', '') # Give me the value of key 'q', If 'q' doesn't exist → give me '' (empty string) instead of crashing  
    if query:
        subjects = Subject.objects.filter(name__icontains=query) # name → the field in Subject model → "apply this lookup to this field → contains this text, ignore uppercase/lowercase"
    else:
        subjects = Subject.objects.all()
    return render(req, 'school/subject_list.html', {"subjects": subjects, "query": query})


@login_required
def subject_create(req):
    if req.method == "POST":
        form = SubjectForm(req.POST)
        if form.is_valid():
            form.save()
            return redirect('school:subject_list')  # PRG pattern
        else:
            return render(req, 'school/subject_create.html', {"form": form})
    else:
        form = SubjectForm()
        return render(req, 'school/subject_create.html', {"form": form})

@login_required
def subject_update(req, pk):
    subject = get_object_or_404(Subject, pk=pk)
    if req.method == "POST":
        form = SubjectForm(req.POST, instance=subject)
        if form.is_valid():
            form.save()
            return redirect('school:subject_list')  # PRG pattern
    else:
        form = SubjectForm(instance=subject)
    return render(req, 'school/subject_update.html', {"form": form, "subject": subject})

@login_required
def subject_delete(req, pk):
    subject = get_object_or_404(Subject, pk=pk)
    if req.method == "POST":
        subject.delete()
        return redirect('school:subject_list')
    return render(req, 'school/subject_confirm_delete.html', {"subject": subject})


#############################   Grades    ###############
@login_required
def grade_list(req):
    query = req.GET.get('q', '')     # Search by student ID or subject name via ?q= parameter
    if query:
        if query.isdigit():
            grades = Grade.objects.filter(student__id=int(query)) # by id
        else:
            grades = Grade.objects.filter(subject__name__icontains=query) # by name
    else:
        grades = Grade.objects.all()
    return render(req, 'school/grade_list.html', {"grades": grades, "query": query})

@login_required
def grade_create(req):
    if req.method == "POST":
        form = GradeForm(req.POST)
        if form.is_valid():
            form.save()
            return redirect('school:grade_list')  # PRG pattern
        else:
            return render(req, 'school/grade_create.html', {"form": form})
    else:
        form = GradeForm()
        return render(req, 'school/grade_create.html', {"form": form})

@login_required
def grade_update(req, pk):
    grade = get_object_or_404(Grade, pk=pk)
    if req.method == "POST":
        form = GradeForm(req.POST, instance=grade)
        if form.is_valid():
            form.save()
            return redirect('school:grade_list')  # PRG pattern
    else:
        form = GradeForm(instance=grade)
    return render(req, 'school/grade_update.html', {"form": form, "grade": grade})

@login_required
def grade_delete(req, pk):
    grade = get_object_or_404(Grade, pk=pk)
    if req.method == "POST":
        grade.delete()
        return redirect('school:grade_list')
    return render(req, 'school/grade_confirm_delete.html', {"grade": grade})


##########################################contact
# NO @login_required bec,public page

def contact(req):
    if req.method == "POST":
        form = ContactForm(req.POST)
        if form.is_valid():
            form.save()
            return render(req, 'school/contact.html', {"form": ContactForm(), "success": True})
        else:
            return render(req, 'school/contact.html', {"form": form})
    else:
        form = ContactForm()
        return render(req, 'school/contact.html', {"form": form})
    
    

#################################reg.
def register(req):
    if req.method == 'POST':
        form = UserCreationForm(req.POST)
        if form.is_valid():
            user = form.save()
            login(req, user)
            return redirect('school:home')
    else:
        form = UserCreationForm()
    return render(req, 'school/register.html', {'form': form})


