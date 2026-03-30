from rest_framework import serializers
from .models import User, StartupIdea, MarketAnalysis, Competitor, SkillsGapAnalysis, AnalysisReport, UserActivity

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'picture', 'company_name', 'role', 'website', 
                  'subscription_plan', 'analyses_remaining', 'created_at']
        read_only_fields = ['id', 'created_at']


class StartupIdeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartupIdea
        fields = [
            'id', 'title', 'description', 'industry', 'target_market', 
            'business_model', 'investment_range', 'problem_solved', 
            'target_audience', 'revenue_streams', 'viability_score', 
            'market_size', 'competition_level', 'key_features', 'challenges',
            'status', 'is_favorite', 'created_at', 'updated_at', 'analyzed_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StartupIdeaDetailSerializer(StartupIdeaSerializer):
    market_analysis = serializers.JSONField(read_only=True)
    
    class Meta(StartupIdeaSerializer.Meta):
        fields = StartupIdeaSerializer.Meta.fields + ['market_analysis']


class MarketAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketAnalysis
        fields = [
            'id', 'industry', 'region', 'compare_with', 'market_size_tam',
            'market_size_sam', 'market_size_som', 'growth_rate', 'key_trends',
            'customer_segments', 'market_drivers', 'market_barriers',
            'regulatory_factors', 'analysis_summary', 'market_maturity',
            'competition_intensity', 'opportunity_score', 'entry_strategies',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CompetitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competitor
        fields = [
            'id', 'name', 'website', 'idea_description', 'region', 'focus_area',
            'description', 'founded_year', 'headquarters', 'market_presence',
            'funding_stage', 'total_funding', 'strengths', 'weaknesses',
            'opportunities', 'threats', 'market_share', 'key_features',
            'target_customers', 'pricing_model', 'review_sentiment',
            'threat_score', 'market_leader_status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SkillsGapAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillsGapAnalysis
        fields = [
            'id', 'skills', 'startup_type', 'experience_level', 'required_skills',
            'current_skills', 'gap_skills', 'recommendations', 'skill_areas',
            'readiness_score', 'top_gaps', 'strengths', 'learning_path',
            'timeline_projection', 'recommended_roles', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AnalysisReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisReport
        fields = [
            'id', 'report_type', 'title', 'content', 'pdf_url', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ['id', 'action', 'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['email', 'name', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")
        
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password")
        
        return user
