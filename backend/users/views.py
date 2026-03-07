from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(["POST"])
def register(request):

    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password required"})

    if User.objects.filter(email=email).exists():
        return Response({"error": "User already exists"})

    # email কে username হিসেবে ব্যবহার
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password
    )

    return Response({"message": "User registered successfully"})


@api_view(["POST"])
def login(request):

    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"})

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "email": user.email
    })