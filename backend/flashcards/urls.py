from django.urls import path
from .views import register, login_user, create_flashcard, get_flashcards, get_user_classes, list_classes, join_class
from .views import create_class
from .views import get_flashcard_sets, get_flashcards_in_set, create_flashcard_set

urlpatterns = [
    path('api/register/', register, name='register'),
    path('api/login/', login_user, name='login'),
    path('api/flashcards/', get_flashcards, name='get_flashcards'),
    path('api/create-flashcard/', create_flashcard, name='create_flashcard'),
    path('api/user-classes/', get_user_classes, name='get_user_classes'),
    path('api/classes/', list_classes, name='list_classes'),
    path('api/join-class/', join_class, name='join_class'),
    path('api/create-class/', create_class, name='create_class'),
    path('api/flashcard-sets/', get_flashcard_sets, name='get_flashcard_sets'),
    path('api/flashcards/set/', get_flashcards_in_set, name='get_flashcards_in_set'),
    path('api/create-flashcard-set/', create_flashcard_set, name='create_flashcard_set'),
]
