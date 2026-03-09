from django.urls import path
from .views import register, login, forgot_password, reset_password

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login, name="login"),
    path("forgot-password/", forgot_password, name="forgot_password"),
    path("reset-password/", reset_password, name="reset_password"),
]