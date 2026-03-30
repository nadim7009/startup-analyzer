from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from django.utils import timezone
from django.db.models import Q, Count
import jwt
import json
import traceback

from .models import User, StartupIdea, MarketAnalysis, Competitor, SkillsGapAnalysis, AnalysisReport, UserActivity
from .serializers import (
    UserSerializer, StartupIdeaSerializer,
    StartupIdeaDetailSerializer, MarketAnalysisSerializer,
    CompetitorSerializer, SkillsGapAnalysisSerializer,
    AnalysisReportSerializer, RegisterSerializer, LoginSerializer,
    UserActivitySerializer
)
from .ai_service import (
    generate_startup_analysis, 
    analyze_market_with_ai, 
    analyze_competitor_with_ai,
    analyze_skills_gap_with_ai,
    discover_competitors_with_ai
)


# ---------------- USER ---------------- #

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        return Response(self.get_serializer(request.user).data)
    
    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        user = request.user
        user.name = request.data.get('name', user.name)
        user.company_name = request.data.get('company_name', user.company_name)
        user.role = request.data.get('role', user.role)
        user.website = request.data.get('website', user.website)
        user.save()
        return Response(self.get_serializer(user).data)


# ---------------- STARTUP IDEA ---------------- #

class StartupIdeaViewSet(viewsets.ModelViewSet):
    queryset = StartupIdea.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = StartupIdeaSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StartupIdeaDetailSerializer
        return StartupIdeaSerializer

    def get_queryset(self):
        return StartupIdea.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        UserActivity.objects.create(
            user=self.request.user,
            action='idea_created',
            metadata={'idea_title': serializer.instance.title}
        )

    @action(detail=False, methods=['post'])
    def generate(self, request):
        """Generate a new startup idea using AI"""
        try:
            # Get data from frontend
            title = request.data.get('title', '')
            description = request.data.get('description', '')
            industry = request.data.get('industry', '')
            target_market = request.data.get('target_market', 'Global')
            business_model = request.data.get('business_model', 'SaaS')
            investment_range = request.data.get('investment_range', '')
            
            # Log incoming request for debugging
            print(f"Generate idea request - Industry: {industry}, Region: {target_market}")
            
            # Parse description to extract interests
            lines = description.split('\n')
            interests = ""
            region = target_market
            
            for line in lines:
                if 'Interests:' in line:
                    interests = line.replace('Interests:', '').strip()
                elif 'Region:' in line:
                    region = line.replace('Region:', '').strip()
            
            # Call AI service
            idea_data = generate_startup_analysis(
                industry, 
                interests if interests else description[:100], 
                f"Create a startup in {industry} industry for {region} market"
            )
            
            # Ensure idea_data has all required fields
            if not idea_data:
                idea_data = {}
            
            # Create the idea in database
            idea = StartupIdea.objects.create(
                user=request.user,
                title=title or f"{industry} Startup Idea",
                description=idea_data.get('description', description),
                industry=industry,
                target_market=region,
                business_model=business_model,
                problem_solved=idea_data.get('problem_solved', ''),
                target_audience=idea_data.get('target_audience', ''),
                revenue_streams=idea_data.get('revenue_streams', []),
                viability_score=idea_data.get('viability_score', 75),
                market_size=idea_data.get('market_size', '$25B'),
                competition_level=idea_data.get('competition_level', 'Medium'),
                key_features=idea_data.get('key_features', []),
                challenges=idea_data.get('challenges', []),
                investment_range=investment_range,
                status='completed',
                analyzed_at=timezone.now(),
                market_analysis={"result": idea_data}
            )
            
            # Track activity
            UserActivity.objects.create(
                user=request.user,
                action='idea_generated',
                metadata={'idea_id': str(idea.id), 'industry': industry}
            )
            
            serializer = self.get_serializer(idea)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # Log the full error for debugging
            print(f"Error in generate: {str(e)}")
            print(traceback.format_exc())
            
            # Return proper JSON error response
            return Response(
                {
                    "error": str(e),
                    "message": "Failed to generate idea. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        """Toggle favorite status"""
        idea = self.get_object()
        idea.is_favorite = not idea.is_favorite
        idea.save()
        return Response({'is_favorite': idea.is_favorite})


# ---------------- MARKET ANALYSIS ---------------- #

class MarketAnalysisViewSet(viewsets.ModelViewSet):
    queryset = MarketAnalysis.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = MarketAnalysisSerializer

    def get_queryset(self):
        return MarketAnalysis.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        UserActivity.objects.create(
            user=self.request.user,
            action='market_analysis_created',
            metadata={'industry': serializer.instance.industry}
        )

    @action(detail=False, methods=['post'])
    def analyze(self, request):
        """Analyze a market using AI"""
        try:
            industry = request.data.get('industry', '')
            region = request.data.get('region', 'Global')
            
            if not industry:
                return Response(
                    {"error": "Industry is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            print(f"Market analysis request - Industry: {industry}, Region: {region}")
            
            # Call AI service
            market_data = analyze_market_with_ai(industry, region)
            
            # Create market analysis
            analysis = MarketAnalysis.objects.create(
                user=request.user,
                industry=industry,
                region=region,
                market_size_tam=market_data.get('tam', ''),
                market_size_sam=market_data.get('sam', ''),
                market_size_som=market_data.get('som', ''),
                growth_rate=market_data.get('growth_rate', ''),
                key_trends=market_data.get('key_trends', []),
                customer_segments=market_data.get('customer_segments', []),
                market_drivers=market_data.get('market_drivers', []),
                market_barriers=market_data.get('market_barriers', []),
                regulatory_factors=market_data.get('regulatory_factors', []),
                analysis_summary=market_data.get('summary', ''),
                market_maturity=market_data.get('market_maturity', 'Emerging'),
                competition_intensity=market_data.get('competition_intensity', 'Medium'),
                opportunity_score=market_data.get('opportunity_score', 5),
                entry_strategies=market_data.get('entry_strategies', [])
            )
            
            UserActivity.objects.create(
                user=request.user,
                action='market_analyzed',
                metadata={'industry': industry, 'region': region}
            )
            
            serializer = self.get_serializer(analysis)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Error in market analysis: {str(e)}")
            print(traceback.format_exc())
            
            return Response(
                {
                    "error": str(e),
                    "message": "Failed to analyze market. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def compare(self, request):
        """Compare two markets"""
        try:
            industry = request.data.get('industry', '')
            region_a = request.data.get('region_a', '')
            region_b = request.data.get('region_b', '')
            
            if not industry or not region_a or not region_b:
                return Response(
                    {"error": "Industry, region_a, and region_b are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            comparison_data = analyze_market_with_ai(industry, region_a, region_b)
            return Response(comparison_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Error in market comparison: {str(e)}")
            return Response(
                {
                    "error": str(e),
                    "message": "Failed to compare markets"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ---------------- COMPETITOR ---------------- #

class CompetitorViewSet(viewsets.ModelViewSet):
    queryset = Competitor.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CompetitorSerializer

    def get_queryset(self):
        return Competitor.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        UserActivity.objects.create(
            user=self.request.user,
            action='competitor_created',
            metadata={'competitor_name': serializer.instance.name}
        )

    @action(detail=False, methods=['post'])
    def analyze(self, request):
        """Analyze a competitor using AI"""
        try:
            name = request.data.get('name', '')
            website = request.data.get('website', '')
            industry = request.data.get('industry', '')
            idea_description = request.data.get('idea_description', '')
            region = request.data.get('region', 'Global')
            focus_area = request.data.get('focus_area', 'comprehensive')
            
            if not name or not industry:
                return Response(
                    {"error": "Name and industry are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            print(f"Competitor analysis request - Name: {name}, Industry: {industry}")
            
            # Call AI service
            competitor_data = analyze_competitor_with_ai(name, website, industry)
            
            # Create competitor
            competitor = Competitor.objects.create(
                user=request.user,
                name=name,
                website=website,
                idea_description=idea_description,
                region=region,
                focus_area=focus_area,
                description=competitor_data.get('description', ''),
                founded_year=competitor_data.get('founded_year'),
                headquarters=competitor_data.get('headquarters', ''),
                market_presence=competitor_data.get('market_presence', ''),
                funding_stage=competitor_data.get('funding_stage', ''),
                total_funding=competitor_data.get('total_funding', ''),
                strengths=competitor_data.get('strengths', []),
                weaknesses=competitor_data.get('weaknesses', []),
                opportunities=competitor_data.get('opportunities', []),
                threats=competitor_data.get('threats', []),
                market_share=competitor_data.get('market_share', ''),
                key_features=competitor_data.get('key_features', []),
                target_customers=competitor_data.get('target_customers', []),
                pricing_model=competitor_data.get('pricing_model', ''),
                review_sentiment=competitor_data.get('review_sentiment', ''),
                threat_score=competitor_data.get('threat_score', 5),
                market_leader_status=competitor_data.get('market_leader_status', False)
            )
            
            UserActivity.objects.create(
                user=request.user,
                action='competitor_analyzed',
                metadata={'competitor_name': name}
            )
            
            serializer = self.get_serializer(competitor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Error in competitor analysis: {str(e)}")
            print(traceback.format_exc())
            
            return Response(
                {
                    "error": str(e),
                    "message": "Failed to analyze competitor. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def discover(self, request):
        """Discover competitors based on industry and idea using AI"""
        try:
            industry = request.data.get('industry', '')
            idea_description = request.data.get('idea_description', '')
            region = request.data.get('region', 'Global')
            
            if not industry:
                return Response(
                    {"error": "Industry is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not idea_description:
                return Response(
                    {"error": "Idea description is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            print(f"Competitor discovery request - Industry: {industry}, Region: {region}")
            
            # Call AI service to discover competitors
            competitors_data = discover_competitors_with_ai(industry, idea_description, region)
            
            return Response({"competitors": competitors_data}, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Error in competitor discovery: {str(e)}")
            print(traceback.format_exc())
            
            return Response(
                {
                    "error": str(e),
                    "message": "Failed to discover competitors. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ---------------- SKILLS GAP ANALYSIS ---------------- #

class SkillsGapAnalysisViewSet(viewsets.ModelViewSet):
    queryset = SkillsGapAnalysis.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SkillsGapAnalysisSerializer

    def get_queryset(self):
        return SkillsGapAnalysis.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        UserActivity.objects.create(
            user=self.request.user,
            action='skills_analysis_created',
            metadata={'startup_type': serializer.instance.startup_type}
        )

    @action(detail=False, methods=['post'])
    def analyze(self, request):
        """Analyze skills gap using AI"""
        try:
            skills = request.data.get('skills', '')
            startup_type = request.data.get('startup_type', 'SaaS Platform')
            experience_level = request.data.get('experience_level', '1-2 years')
            
            if not skills:
                return Response(
                    {"error": "Skills are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            print(f"Skills analysis request - Type: {startup_type}, Experience: {experience_level}")
            
            # Call AI service
            skills_data = analyze_skills_gap_with_ai(skills, startup_type, experience_level)
            
            # Create skills analysis
            analysis = SkillsGapAnalysis.objects.create(
                user=request.user,
                skills=skills,
                startup_type=startup_type,
                experience_level=experience_level,
                required_skills=skills_data.get('required_skills', []),
                current_skills=skills_data.get('current_skills', []),
                gap_skills=skills_data.get('gap_skills', []),
                recommendations=skills_data.get('recommendations', []),
                skill_areas=skills_data.get('skill_areas', []),
                readiness_score=skills_data.get('readiness_score', 0),
                top_gaps=skills_data.get('top_gaps', []),
                strengths=skills_data.get('strengths', []),
                learning_path=skills_data.get('learning_path', []),
                timeline_projection=skills_data.get('timeline_projection', []),
                recommended_roles=skills_data.get('recommended_roles', [])
            )
            
            UserActivity.objects.create(
                user=request.user,
                action='skills_analyzed',
                metadata={'startup_type': startup_type, 'score': analysis.readiness_score}
            )
            
            serializer = self.get_serializer(analysis)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Error in skills analysis: {str(e)}")
            print(traceback.format_exc())
            
            return Response(
                {
                    "error": str(e),
                    "message": "Failed to analyze skills gap. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ---------------- DASHBOARD ---------------- #

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    try:
        ideas_count = StartupIdea.objects.filter(user=request.user).count()
        markets_count = MarketAnalysis.objects.filter(user=request.user).count()
        competitors_count = Competitor.objects.filter(user=request.user).count()
        skills_count = SkillsGapAnalysis.objects.filter(user=request.user).count()
        
        recent_ideas = StartupIdea.objects.filter(user=request.user).order_by('-created_at')[:5]
        recent_markets = MarketAnalysis.objects.filter(user=request.user).order_by('-created_at')[:5]
        recent_competitors = Competitor.objects.filter(user=request.user).order_by('-created_at')[:5]
        
        return Response({
            'counts': {
                'ideas': ideas_count,
                'markets': markets_count,
                'competitors': competitors_count,
                'skills_analyses': skills_count,
                'total': ideas_count + markets_count + competitors_count + skills_count
            },
            'recent': {
                'ideas': StartupIdeaSerializer(recent_ideas, many=True).data,
                'markets': MarketAnalysisSerializer(recent_markets, many=True).data,
                'competitors': CompetitorSerializer(recent_competitors, many=True).data,
            }
        })
    except Exception as e:
        print(f"Error in dashboard stats: {str(e)}")
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ---------------- USER ACTIVITY ---------------- #

class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user).order_by('-created_at')[:50]


# ---------------- REPORT ---------------- #

class AnalysisReportViewSet(viewsets.ModelViewSet):
    queryset = AnalysisReport.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = AnalysisReportSerializer

    def get_queryset(self):
        return AnalysisReport.objects.filter(
            Q(idea__user=self.request.user) |
            Q(market_analysis__user=self.request.user) |
            Q(competitor__user=self.request.user) |
            Q(skills_analysis__user=self.request.user)
        )


# ---------------- AUTH ---------------- #

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            UserActivity.objects.create(
                user=user,
                action='user_registered',
                metadata={'email': user.email}
            )
            
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Error in registration: {str(e)}")
            return Response(
                {"error": str(e), "message": "Registration failed"},
                status=status.HTTP_400_BAD_REQUEST
            )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            
            # Update last login
            user.last_login_at = timezone.now()
            user.save()
            
            # Track activity
            UserActivity.objects.create(
                user=user,
                action='user_logged_in',
                metadata={'ip': request.META.get('REMOTE_ADDR', '')}
            )
            
            token = jwt.encode(
                {"id": str(user.id), "email": user.email},
                settings.SECRET_KEY,
                algorithm="HS256"
            )
            
            return Response({
                "token": token,
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.name,
                    "picture": user.picture,
                    "subscription_plan": user.subscription_plan,
                    "analyses_remaining": user.analyses_remaining
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Error in login: {str(e)}")
            return Response(
                {"error": str(e), "message": "Login failed"},
                status=status.HTTP_400_BAD_REQUEST
            )


class VerifyTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": str(request.user.id),
            "email": request.user.email,
            "name": request.user.name,
            "picture": request.user.picture,
            "subscription_plan": request.user.subscription_plan,
            "analyses_remaining": request.user.analyses_remaining
        })
