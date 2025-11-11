from django.urls import path
from .views import register, login_user, create_flashcard, get_flashcards, get_user_classes

urlpatterns = [
    path('api/register/', register, name='register'),
    path('api/login/', login_user, name='login'),
    path('api/flashcards/', get_flashcards, name='get_flashcards'),
    path('api/create-flashcard/', create_flashcard, name='create_flashcard'),
    path('api/user-classes/', get_user_classes, name='get_user_classes'),
]
