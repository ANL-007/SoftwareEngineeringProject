from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Flashcard, Class, ClassMember, FlashcardSet


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
        return Response({'error': ' '.join(ve.messages)}, status=status.HTTP_400_BAD_REQUEST)

    # Create the user
    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'success': True, 'username': user.username}, status=status.HTTP_201_CREATED)




@api_view(['GET'])
def get_flashcard_sets(request):
    """Fetch flashcard sets for a given user (username via query param)"""
    try:
        username = request.query_params.get('username')
        if not username:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        sets = FlashcardSet.objects.filter(creator=user).values('id', 'name', 'description', 'class_obj_id', 'created_at')
        return Response(list(sets), status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_flashcards_in_set(request):
    """Fetch flashcards in a specific flashcard set (set_id via query param)"""
    try:
        set_id = request.query_params.get('set_id')
        if not set_id:
            return Response({'error': 'set_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            flashcard_set = FlashcardSet.objects.get(id=set_id)
        except FlashcardSet.DoesNotExist:
            return Response({'error': 'Flashcard set not found'}, status=status.HTTP_404_NOT_FOUND)

        flashcards = Flashcard.objects.filter(flashcard_set=flashcard_set).values('id', 'front_text', 'back_text', 'creator_id')
        return Response(list(flashcards), status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_flashcard_set(request):
    """Create a new FlashcardSet. Expects: username, name, description (optional), class_id (optional)"""
    try:
        username = request.data.get('username')
        name = request.data.get('name', '').strip()
        description = request.data.get('description', '').strip()
        class_id = request.data.get('class_id')

        if not username or not name:
            return Response({'error': 'username and name are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        class_obj = None
        if class_id:
            try:
                class_obj = Class.objects.get(id=class_id)
            except Class.DoesNotExist:
                return Response({'error': 'Class not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            class_obj, _ = Class.objects.get_or_create(
                class_name=f"{username}'s Flashcards",
                defaults={'class_number': f'DEFAULT-{username}', 'description': 'Default flashcard collection'}
            )

        new_set = FlashcardSet.objects.create(class_obj=class_obj, name=name, description=description, creator=user)
        return Response({'success': True, 'id': new_set.id, 'name': new_set.name}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_flashcards(request):
    """Fetch flashcards created by a specific user"""
    try:
        username = request.query_params.get('username')
        
        if not username:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        flashcards = Flashcard.objects.filter(creator=user).values('id', 'front_text', 'back_text')
        return Response(list(flashcards), status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_flashcard(request):
    """Create a new flashcard for the authenticated user"""
    try:
        username = request.data.get('username')
        question = request.data.get('question', '').strip()
        answer = request.data.get('answer', '').strip()
        set_id = request.data.get('set_id')

        if not username:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not question or not answer:
            return Response({'error': 'Question and answer are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        flashcard_set = None
        if set_id:
            try:
                flashcard_set = FlashcardSet.objects.get(id=set_id)
            except FlashcardSet.DoesNotExist:
                return Response({'error': 'Flashcard set not found'}, status=status.HTTP_404_NOT_FOUND)

        # If no set provided, ensure a default class and default set exist for the user
        if not flashcard_set:
            default_class, _ = Class.objects.get_or_create(
                class_name=f"{username}'s Flashcards",
                defaults={'class_number': f'DEFAULT-{username}', 'description': 'Default flashcard collection'}
            )
            flashcard_set, _ = FlashcardSet.objects.get_or_create(
                class_obj=default_class,
                name=f"{username}'s Default Set",
                defaults={'description': 'Auto-created default set', 'creator': user}
            )

        flashcard = Flashcard.objects.create(
            class_obj=flashcard_set.class_obj,
            creator=user,
            flashcard_set=flashcard_set,
            front_text=question,
            back_text=answer
        )

        return Response({
            'success': True,
            'id': flashcard.id,
            'question': flashcard.front_text,
            'answer': flashcard.back_text
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_user_classes(request):
    """Fetch classes the user is enrolled in"""
    try:
        username = request.query_params.get('username')

        if not username:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        class_memberships = ClassMember.objects.filter(user=user).select_related('class_obj')
        classes_data = []
        for membership in class_memberships:
            classes_data.append({
                'id': membership.class_obj.id,
                'class_name': membership.class_obj.class_name,
                'class_number': membership.class_obj.class_number,
                'description': membership.class_obj.description,
                'role_in_class': membership.role_in_class
            })

        return Response(classes_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def list_classes(request):
    """Return all classes from the Class table"""
    try:
        classes = Class.objects.all().values('id', 'class_name', 'class_number', 'description')
        return Response(list(classes), status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def join_class(request):
    """Enroll a user into a class via class_id"""
    try:
        username = request.data.get('username')
        class_id = request.data.get('class_id')

        if not username or not class_id:
            return Response({'error': 'username and class_id required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            class_obj = Class.objects.get(id=class_id)
        except Class.DoesNotExist:
            return Response({'error': 'Class not found'}, status=status.HTTP_404_NOT_FOUND)

        ClassMember.objects.get_or_create(user=user, class_obj=class_obj, defaults={'role_in_class': 'Student'})
        return Response({'success': True}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_class(request):
    """Create a Class and optionally add the creator as ClassMember (Leader)"""
    try:
        class_name = request.data.get('class_name', '').strip()
        class_number = request.data.get('class_number', '').strip()
        description = request.data.get('description', '').strip()
        username = request.data.get('username')
        role = request.data.get('role', 'Leader')

        if not class_name or not class_number:
            return Response({'error': 'class_name and class_number are required'}, status=status.HTTP_400_BAD_REQUEST)

        new_class = Class.objects.create(class_name=class_name, class_number=class_number, description=description)

        # If a username was provided, try to add with the specified role (validate role)
        if username:
            try:
                user = User.objects.get(username=username)
                # validate role against model choices
                allowed_roles = [r[0] for r in ClassMember.ROLE_CHOICES]
                role_to_use = role if role in allowed_roles else 'Leader'
                ClassMember.objects.create(user=user, class_obj=new_class, role_in_class=role_to_use)
            except User.DoesNotExist:
                # ignore if user not found; class still created
                pass

        return Response({'success': True, 'id': new_class.id, 'class_name': new_class.class_name}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)