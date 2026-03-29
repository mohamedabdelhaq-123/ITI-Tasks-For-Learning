from django.forms import ModelForm
from school.models import Student, Subject, Grade, Contact

class StudentForm(ModelForm):
    class Meta:
        model = Student
        # fields = "__all__" # include all fields automatically , not best practice may expose id
        fields = ["name","age","email","img"]

# Subject form — only the name field is needed
class SubjectForm(ModelForm):
    class Meta:
        model = Subject
        fields = ["name"]

# Grade form — student, subject, and score fields
class GradeForm(ModelForm):
    class Meta:
        model = Grade
        fields = ["student","subject","grade"]

# Contact form — public form, no auth needed
class ContactForm(ModelForm):
    class Meta:
        model = Contact
        fields = ["email","message"]