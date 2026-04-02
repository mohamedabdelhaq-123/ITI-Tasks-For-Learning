from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator

# Create your models here.

class Student(models.Model): # classes are mapped to tables
    # id (PK) is made in backgrd for each class with type BigAutoField (start from 1 and inc. gradually)
    # name
    name = models.CharField(max_length=30)
    # age
    age = models.IntegerField(validators=[MinValueValidator(6,"Error: Underage"),MaxValueValidator(19,"Eroor: OverAged")])
    # email
    email = models.EmailField(unique=True)
    # image
    img = models.ImageField(upload_to='students/')  # img will be uploaded to MEDIA_ROOT ===> baseDir/media/students/
# the imgfield in backgrd go to settings.py and read MEDIA_ROOT, the upload_to is to know where to put the images inside this root
# why not import MEDIA_URL? bec, importing settings in each model makes code tightly coupling
# need to download package pillow (image processing) to validate is the uploaded file is real img or for ex: exe or pdf or...
    def __str__(self): # without it admin will show Student object (1), with it shows: "MOMO"
        return self.name

class Subject(models.Model):
    name= models.CharField(max_length=70,unique=True)
    def __str__(self):
        return self.name

class Grade(models.Model):
    # it also has it's PK. In django mapping no concept of composite PK (2 FK => student & Subject ) SO need other way to prevent same student take 2 diff. grades
    student= models.ForeignKey(Student,on_delete=models.CASCADE) # fk for student table, when student is deleted, so delete cascaded data
    subject= models.ForeignKey(Subject,on_delete=models.CASCADE)
    grade= models.IntegerField(validators=[MinValueValidator(0,"Error: Grade must be postive number "),MaxValueValidator(100,"Eroor: Grade must be under 100 ")]) # need to make max and min values
    # validators is array of instances, since Minvaluevalid. is a class
    def __str__(self):
        return self.grade
    
    # to check uniquness=> class for metadata (not function bec. when django start to build db need to know the settings not execute code)
    class Meta:
        constraints=[models.UniqueConstraint(fields=["student","subject"], name="unique_student_subject")] # fields to make unique, name is like rule name

    
class Contact(models.Model): # class for contact us message
    email=models.EmailField() # design dependent not good to be unique
    message=models.TextField(blank=True)  # blank true means optional
    date= models.DateTimeField(auto_now_add=True) # auto_now_add is best for creation timestamp (our case), while auto_now is best for last modified
    def __str__(self):
        return self.name

## After models are finished then time for the construction of tables by the migrations
# makemigrations => scans models.py  => create py file in migrations folder in app => operations needed to build db [blueprint](file in py so then can map to any type of db) 
# { python manage.py makemigrations}
# migrate  => read migration files   => SQL cmds    => executed on sqlite file  => tables are created                              
# { python manage.py migrate}