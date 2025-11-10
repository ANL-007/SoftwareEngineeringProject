from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    global_role = models.CharField(max_length=50, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    
    def __str__(self):
        return self.user.username

# Create your models here.
class Quiz(models.Model):
        id = models.IntegerField
        ClassID = models.IntegerField
        DueDate = models.DateTimeField(auto_now_add=True)

  
        def __str__(self):
            return self.id

class Flashcard(models.Model):
    class_obj = models.ForeignKey('Class', on_delete=models.CASCADE)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    front_text = models.TextField()
    back_text = models.TextField()

    def __str__(self):
        return f"Flashcard {self.id} in {self.class_obj.class_name}"

class FlashcardLeaderboard(models.Model):
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("flashcard", "user")


class FlashcardStudyTime(models.Model):
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time_spent = models.IntegerField(default=0)  # seconds
    last_studied = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("flashcard", "user")

class Class(models.Model):
    class_name = models.CharField(max_length=100)
    class_number = models.CharField(max_length=20)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.class_name} ({self.class_number})"


class ClassMember(models.Model):
    ROLE_CHOICES = (
        ("Leader", "Leader"),
        ("Student", "Student"),
        ("TA", "Teaching Assistant"),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    role_in_class = models.CharField(max_length=20, choices=ROLE_CHOICES)

    class Meta:
        unique_together = ("user", "class_obj")  # one entry per user per class

    def __str__(self):
        return f"{self.user.username} - {self.class_obj.class_name} ({self.role_in_class})"

class MessageBoard(models.Model):
    class_obj = models.OneToOneField(Class, on_delete=models.CASCADE)

    def __str__(self):
        return f"Board for {self.class_obj.class_name}"


class Message(models.Model):
    board = models.ForeignKey(MessageBoard, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message_text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} at {self.timestamp}"

class UserWarning(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Warning for {self.user.username}: {self.reason}"
