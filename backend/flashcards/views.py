from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User  # <-- add this line
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)  # creates a session
        return Response({'success': True})
    else:
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def register(request):
    username = request.data.get('username', '').strip()
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '')

    if not username or not email or not password:
        return Response(
            {'error': 'Username, email, and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate password using Django's validators
    try:
        validate_password(password)  # this raises django.core.exceptions.ValidationError if invalid
    except ValidationError as ve:
        # ve is an exception containing a list of error messages
        # Send them back to the client in a friendly format
        return Response({'error': ' '.join(ve.messages)}, status=status.HTTP_400_BAD_REQUEST)

    # If validators pass, create the user (password is hashed by create_user)
    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'success': True, 'username': user.username}, status=status.HTTP_201_CREATED)