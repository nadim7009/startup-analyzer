from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import uuid

class UserManager(BaseUserManager):
    """Define a custom manager for User model with no username field."""
    
    def _create_user(self, email, name, password=None, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_user(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, name, password, **extra_fields)
    
    def create_superuser(self, email, name, password=None, **extra_fields):
        """Create and save a superuser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self._create_user(email, name, password, **extra_fields)


class User(AbstractUser):
    """Extended user model"""
    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    picture = models.URLField(blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    subscription_plan = models.CharField(
        max_length=50,
        choices=[('free', 'Free Trial'), ('starter', 'Starter'), ('pro', 'Pro'), ('enterprise', 'Enterprise')],
        default='free'
    )
    analyses_remaining = models.IntegerField(default=5)
    analyses_total = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    groups = models.ManyToManyField('auth.Group', related_name='users_user_set', blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name='users_user_set', blank=True)
    
    def __str__(self):
        return self.email
    
    class Meta:
        db_table = 'users'


class StartupIdea(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ideas')
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    industry = models.CharField(max_length=100, blank=True, null=True)
    target_market = models.CharField(max_length=255, blank=True, null=True)
    business_model = models.CharField(max_length=100, blank=True, null=True)
    investment_range = models.CharField(max_length=100, blank=True, null=True)
    
    # AI analysis results
    problem_solved = models.TextField(blank=True, null=True)
    target_audience = models.TextField(blank=True, null=True)
    revenue_streams = models.JSONField(default=list, blank=True)
    viability_score = models.IntegerField(default=0, null=True, blank=True)
    market_size = models.CharField(max_length=100, blank=True, null=True)
    competition_level = models.CharField(max_length=50, blank=True, null=True)
    key_features = models.JSONField(default=list, blank=True)
    challenges = models.JSONField(default=list, blank=True)
    market_analysis = models.JSONField(default=dict, blank=True)
    
    status = models.CharField(max_length=50, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending')
    is_favorite = models.BooleanField(default=False)
    analyzed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
        db_table = 'startup_ideas'


class MarketAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='market_analyses')
    
    industry = models.CharField(max_length=100)
    region = models.CharField(max_length=100, default="Bangladesh")
    compare_with = models.CharField(max_length=100, blank=True, null=True)
    
    market_size_tam = models.CharField(max_length=100, blank=True, null=True)
    market_size_sam = models.CharField(max_length=100, blank=True, null=True)
    market_size_som = models.CharField(max_length=100, blank=True, null=True)
    growth_rate = models.CharField(max_length=50, blank=True, null=True)
    
    key_trends = models.JSONField(default=list, blank=True)
    customer_segments = models.JSONField(default=list, blank=True)
    market_drivers = models.JSONField(default=list, blank=True)
    market_barriers = models.JSONField(default=list, blank=True)
    regulatory_factors = models.JSONField(default=list, blank=True)
    analysis_summary = models.TextField(blank=True, null=True)
    
    market_maturity = models.CharField(max_length=50, default='Emerging', blank=True, null=True)
    competition_intensity = models.CharField(max_length=20, default='Medium', blank=True, null=True)
    opportunity_score = models.IntegerField(default=5, blank=True, null=True)
    entry_strategies = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.industry} - {self.region}"
    
    class Meta:
        ordering = ['-created_at']
        db_table = 'market_analyses'


class Competitor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='competitors')
    
    name = models.CharField(max_length=200)
    website = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    
    idea_description = models.TextField(blank=True, null=True)
    region = models.CharField(max_length=100, default="Bangladesh")
    focus_area = models.CharField(max_length=50, default="comprehensive")
    
    founded_year = models.IntegerField(null=True, blank=True)
    headquarters = models.CharField(max_length=255, blank=True, null=True)
    market_presence = models.CharField(max_length=100, blank=True, null=True)
    funding_stage = models.CharField(max_length=50, blank=True, null=True)
    total_funding = models.CharField(max_length=100, blank=True, null=True)
    market_share = models.CharField(max_length=50, blank=True, null=True)
    key_features = models.JSONField(default=list, blank=True)
    target_customers = models.JSONField(default=list, blank=True)
    pricing_model = models.CharField(max_length=255, blank=True, null=True)
    review_sentiment = models.CharField(max_length=255, blank=True, null=True)
    market_leader_status = models.BooleanField(default=False)
    
    strengths = models.JSONField(default=list, blank=True)
    weaknesses = models.JSONField(default=list, blank=True)
    opportunities = models.JSONField(default=list, blank=True)
    threats = models.JSONField(default=list, blank=True)
    threat_score = models.FloatField(default=0, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']
        db_table = 'competitors'


class SkillsGapAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills_analyses')
    startup_idea = models.ForeignKey(StartupIdea, on_delete=models.CASCADE, null=True, blank=True)
    
    skills = models.TextField(blank=True, null=True)
    startup_type = models.CharField(max_length=100, default="SaaS Platform")
    experience_level = models.CharField(max_length=50, default="1-2 years")
    
    required_skills = models.JSONField(default=list, blank=True)
    current_skills = models.JSONField(default=list, blank=True)
    gap_skills = models.JSONField(default=list, blank=True)
    recommendations = models.JSONField(default=list, blank=True)
    skill_areas = models.JSONField(default=list, blank=True)
    readiness_score = models.IntegerField(default=0, null=True, blank=True)
    top_gaps = models.JSONField(default=list, blank=True)
    strengths = models.JSONField(default=list, blank=True)
    learning_path = models.JSONField(default=list, blank=True)
    timeline_projection = models.JSONField(default=list, blank=True)
    recommended_roles = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Skills Analysis - {self.user.email}"
    
    class Meta:
        ordering = ['-created_at']
        db_table = 'skills_gap_analyses'


class UserActivity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=100)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.action}"
    
    class Meta:
        ordering = ['-created_at']
        db_table = 'user_activities'


class AnalysisReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    idea = models.ForeignKey(StartupIdea, on_delete=models.CASCADE, null=True, blank=True)
    market_analysis = models.ForeignKey(MarketAnalysis, on_delete=models.CASCADE, null=True, blank=True)
    competitor = models.ForeignKey(Competitor, on_delete=models.CASCADE, null=True, blank=True)
    skills_analysis = models.ForeignKey(SkillsGapAnalysis, on_delete=models.CASCADE, null=True, blank=True)
    
    report_type = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    content = models.JSONField(default=dict)
    pdf_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
        db_table = 'analysis_reports'