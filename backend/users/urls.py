from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'ideas', views.StartupIdeaViewSet)
router.register(r'market-analysis', views.MarketAnalysisViewSet)
router.register(r'competitors', views.CompetitorViewSet)
router.register(r'skills-gap-analysis', views.SkillsGapAnalysisViewSet)
router.register(r'user-activities', views.UserActivityViewSet)
router.register(r'reports', views.AnalysisReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/verify/', views.VerifyTokenView.as_view(), name='verify-token'),
]