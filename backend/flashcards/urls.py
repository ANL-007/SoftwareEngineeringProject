from django.urls import path
from .views import register, login_user

urlpatterns = [
    path('api/register/', register, name='register'),
    path('api/login/', login_user, name='login'),
]
