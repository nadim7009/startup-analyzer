from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StartupIdea, MarketAnalysis, Competitor, SkillsGapAnalysis, UserActivity, AnalysisReport

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'subscription_plan', 'analyses_remaining', 'is_active', 'created_at')
    list_filter = ('subscription_plan', 'is_active', 'is_staff')
    search_fields = ('email', 'name')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'picture', 'company_name', 'role', 'website')}),
        ('Subscription', {'fields': ('subscription_plan', 'analyses_remaining', 'analyses_total')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at', 'last_login_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )

admin.site.register(User, UserAdmin)
admin.site.register(StartupIdea)
admin.site.register(MarketAnalysis)
admin.site.register(Competitor)
admin.site.register(SkillsGapAnalysis)
admin.site.register(UserActivity)
admin.site.register(AnalysisReport)