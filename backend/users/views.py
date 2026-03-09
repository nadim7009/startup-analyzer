from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


# REGISTER
@api_view(["POST"])
def register(request):

    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "User already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password
    )

    return Response(
        {"message": "User registered successfully"},
        status=status.HTTP_201_CREATED
    )


# LOGIN
@api_view(["POST"])
def login(request):

    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "email": user.email
    })


# FORGOT PASSWORD
@api_view(["POST"])
def forgot_password(request):

    email = request.data.get("email")

    if not email:
        return Response(
            {"error": "Email required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.filter(email=email).first()

    if not user:
        return Response(
            {"error": "User with this email not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        "message": "Email verified. You can reset password."
    })


# RESET PASSWORD
@api_view(["POST"])
def reset_password(request):

    email = request.data.get("email")
    new_password = request.data.get("password")

    if not email or not new_password:
        return Response(
            {"error": "Email and new password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.filter(email=email).first()

    if not user:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    user.set_password(new_password)
    user.save()

    return Response({
        "message": "Password reset successful"
    })