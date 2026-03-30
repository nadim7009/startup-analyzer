import json
import requests
import random
import os

API_KEY = os.getenv("GROQ_API_KEY")


def call_groq_api(prompt, system_message):
    """Generic function to call Groq API"""
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    try:
        print(f"🤖 Calling Groq API...")
        response = requests.post(url, json=data, headers=headers, timeout=30)
        
        if response.status_code != 200:
            print(f"Groq API Error: {response.status_code}")
            return None
            
        result = response.json()
        content = result["choices"][0]["message"]["content"]
        print(f"✅ Groq API Response received")
        
        # Try to extract JSON from response
        try:
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                return json.loads(content[json_start:json_end])
        except:
            pass
            
        return {"raw_response": content}
        
    except Exception as e:
        print(f"Groq API Exception: {str(e)}")
        return None


def generate_startup_analysis(industry, keywords, problem):
    """Generate startup idea using Groq API"""
    
    system_message = """You are a startup expert and innovation consultant. Respond ONLY in valid JSON format with this exact structure:
{
    "title": "Creative startup name (2-5 words)",
    "description": "Detailed 2-3 sentence description of the startup idea",
    "problem_solved": "Clear explanation of the problem being solved",
    "target_audience": "Specific description of who will use this product/service",
    "business_model": "How the business makes money",
    "revenue_streams": ["Revenue stream 1", "Revenue stream 2", "Revenue stream 3"],
    "viability_score": 65-95,
    "market_size": "Market size in USD (e.g., $50B TAM)",
    "competition_level": "Low/Medium/High",
    "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "challenges": ["Challenge 1", "Challenge 2", "Challenge 3"]
}"""
    
    prompt = f"""Generate a detailed startup idea based on:
Industry: {industry}
Interests/Skills: {keywords}
Problem Context: {problem}

Create a unique, innovative startup idea that aligns with these inputs. Make it specific and actionable."""
    
    # Try Groq API first
    result = call_groq_api(prompt, system_message)
    
    if result and isinstance(result, dict) and 'title' in result:
        print("✅ Using Groq AI response")
        return result
    else:
        print("⚠️ Fallback to random data")
        # Fallback to random data if Groq fails
        ideas = {
            "FinTech": {
                "title": f"{industry}Pay - AI-Powered Digital Banking",
                "description": f"A revolutionary {industry} platform that uses AI to provide personalized financial services.",
                "problem_solved": "Traditional banking is slow and impersonal",
                "target_audience": "Young professionals and small businesses",
                "business_model": "SaaS + Transaction Fees",
                "revenue_streams": ["Monthly subscription", "Transaction fees", "Premium features"],
                "viability_score": random.randint(75, 95),
                "market_size": f"${random.randint(20, 80)}B TAM",
                "competition_level": random.choice(["Low", "Medium", "High"]),
                "key_features": ["AI fraud detection", "Instant payments", "Financial insights", "Mobile app"],
                "challenges": ["Regulatory compliance", "Security concerns", "Customer trust"]
            },
            "HealthTech": {
                "title": f"{industry}Care - AI Medical Assistant",
                "description": f"An AI-powered {industry} platform that connects patients with doctors remotely.",
                "problem_solved": "Healthcare access is limited in rural areas",
                "target_audience": "Patients and healthcare providers",
                "business_model": "Subscription + Per-consultation",
                "revenue_streams": ["Doctor subscription", "Patient consultation fees", "Enterprise plans"],
                "viability_score": random.randint(70, 90),
                "market_size": f"${random.randint(30, 100)}B TAM",
                "competition_level": random.choice(["Low", "Medium", "High"]),
                "key_features": ["Video consultations", "AI diagnosis", "Prescription management", "Health records"],
                "challenges": ["Medical regulations", "Data privacy", "Doctor adoption"]
            },
            "EdTech": {
                "title": f"{industry}Learn - Personalized Learning Platform",
                "description": f"An AI-driven {industry} platform that adapts to each student's learning style.",
                "problem_solved": "One-size-fits-all education doesn't work",
                "target_audience": "Students and lifelong learners",
                "business_model": "Freemium + Premium",
                "revenue_streams": ["Course fees", "Premium subscription", "Certificate fees"],
                "viability_score": random.randint(80, 98),
                "market_size": f"${random.randint(15, 60)}B TAM",
                "competition_level": random.choice(["Low", "Medium", "High"]),
                "key_features": ["Adaptive learning", "Video lessons", "Practice exercises", "Progress tracking"],
                "challenges": ["Content quality", "Student engagement", "Pricing model"]
            }
        }
        
        idea = ideas.get(industry, ideas["FinTech"])
        idea["viability_score"] = random.randint(65, 95)
        idea["market_size"] = f"${random.randint(15, 100)}B TAM"
        return idea


def analyze_market_with_ai(industry, region, compare_with=None):
    """Analyze market using Groq API"""
    
    system_message = """You are a market research analyst. Respond ONLY in JSON format with this structure:
{
    "tam": "$X Total Addressable Market",
    "sam": "$X Serviceable Addressable Market",
    "som": "$X Serviceable Obtainable Market",
    "growth_rate": "X% CAGR",
    "key_trends": ["Trend 1", "Trend 2", "Trend 3", "Trend 4"],
    "customer_segments": ["Segment 1", "Segment 2", "Segment 3"],
    "market_drivers": ["Driver 1", "Driver 2", "Driver 3"],
    "market_barriers": ["Barrier 1", "Barrier 2", "Barrier 3"],
    "regulatory_factors": ["Regulation 1", "Regulation 2"],
    "summary": "2-3 sentence executive summary",
    "market_maturity": "Emerging/Growing/Mature",
    "competition_intensity": "Low/Medium/High",
    "opportunity_score": 1-10,
    "entry_strategies": ["Strategy 1", "Strategy 2", "Strategy 3"]
}"""
    
    if compare_with:
        prompt = f"""Compare the {industry} market between {region} and {compare_with}. Provide detailed market analysis."""
    else:
        prompt = f"""Analyze the {industry} market in {region}. Provide detailed market research data."""
    
    # Try Groq API first
    result = call_groq_api(prompt, system_message)
    
    if result and isinstance(result, dict) and 'tam' in result:
        print("✅ Using Groq AI response for market analysis")
        return result
    else:
        print("⚠️ Fallback to random data for market analysis")
        # Fallback to random data
        region_sizes = {
            "Global": random.randint(80, 200),
            "North America": random.randint(50, 120),
            "Europe": random.randint(40, 100),
            "Asia Pacific": random.randint(30, 90),
            "South Asia": random.randint(10, 40),
            "Bangladesh": random.randint(5, 20)
        }
        
        size = region_sizes.get(region, 50)
        growth = random.randint(12, 28)
        
        return {
            "tam": f"${size}B",
            "sam": f"${int(size * 0.3)}B",
            "som": f"${int(size * 0.08)}B",
            "growth_rate": f"{growth}% CAGR",
            "key_trends": ["Digital transformation", "AI adoption", "Mobile-first solutions", "Cloud migration"],
            "customer_segments": ["Enterprise", "SMB", "Startups", "Government"],
            "market_drivers": ["Technology advancement", "Increasing demand", "Government support", "Digital literacy"],
            "market_barriers": ["High entry costs", "Regulatory complexity", "Talent shortage", "Infrastructure gaps"],
            "regulatory_factors": ["Data privacy laws", "Compliance requirements", "Licensing"],
            "summary": f"The {industry} market in {region} shows strong growth potential with {growth}% CAGR.",
            "market_maturity": random.choice(["Emerging", "Growing", "Mature"]),
            "competition_intensity": random.choice(["Low", "Medium", "High"]),
            "opportunity_score": random.randint(6, 9),
            "entry_strategies": ["Focus on niche segments", "Partner with local players", "Build MVP first", "Leverage AI capabilities"]
        }


def analyze_competitor_with_ai(name, website, industry):
    """Analyze competitor using Groq API"""
    
    system_message = """You are a competitive intelligence analyst. Respond ONLY in JSON format with this structure:
{
    "description": "Brief company description",
    "founded_year": 2019,
    "headquarters": "City, Country",
    "market_presence": "Global/Regional/Local",
    "funding_stage": "Bootstrapped/Seed/Series A/Series B/Series C",
    "total_funding": "$X",
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
    "opportunities": ["Opportunity 1", "Opportunity 2"],
    "threats": ["Threat 1", "Threat 2"],
    "market_share": "X%",
    "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "target_customers": ["Customer segment 1", "Customer segment 2"],
    "pricing_model": "Description of pricing",
    "review_sentiment": "Overall sentiment from reviews",
    "threat_score": 1-10,
    "market_leader_status": true/false
}"""
    
    prompt = f"""Analyze the competitor {name} (website: {website}) in the {industry} industry. Provide comprehensive competitive intelligence."""
    
    # Try Groq API first
    result = call_groq_api(prompt, system_message)
    
    if result and isinstance(result, dict) and 'description' in result:
        print("✅ Using Groq AI response for competitor analysis")
        return result
    else:
        print("⚠️ Fallback to random data for competitor analysis")
        threat = random.randint(4, 8)
        return {
            "description": f"{name} is a key player in the {industry} industry, offering innovative solutions.",
            "founded_year": random.randint(2015, 2022),
            "headquarters": random.choice(["San Francisco, CA", "New York, NY", "London, UK", "Singapore", "Bangladesh"]),
            "market_presence": random.choice(["Global", "Regional", "Local"]),
            "funding_stage": random.choice(["Seed", "Series A", "Series B", "Series C"]),
            "total_funding": f"${random.randint(5, 50)}M",
            "strengths": ["Strong brand recognition", "Good market presence", "Established customer base", "Innovative features"],
            "weaknesses": ["High pricing", "Limited features", "Slow innovation", "Poor customer support"],
            "opportunities": ["Emerging markets", "Product expansion", "Strategic partnerships"],
            "threats": ["New entrants", "Market saturation", "Price competition"],
            "market_share": f"{random.randint(5, 25)}%",
            "key_features": ["Analytics dashboard", "Automation tools", "API access", "Mobile app"],
            "target_customers": ["Enterprise", "Mid-market", "Small business"],
            "pricing_model": random.choice(["Subscription-based", "Usage-based", "Freemium", "Enterprise pricing"]),
            "review_sentiment": random.choice(["Very Positive", "Positive", "Mixed", "Neutral"]),
            "threat_score": threat,
            "market_leader_status": threat > 6
        }


def discover_competitors_with_ai(industry, idea_description, region):
    """Discover competitors based on industry and idea using Groq API"""
    
    system_message = """You are a competitive intelligence analyst. Respond ONLY in JSON format with this structure:
{
    "competitors": [
        {
            "name": "Competitor Company Name",
            "website": "competitor-website.com",
            "description": "Brief 1-sentence description of what this competitor does"
        },
        {
            "name": "Another Competitor",
            "website": "another-competitor.com",
            "description": "Brief description of what they do"
        }
    ]
}

Provide 3-5 relevant competitors based on the industry and idea. Include real company names that exist in the market."""
    
    prompt = f"""Find direct competitors for a startup with the following details:
Industry: {industry}
Idea Description: {idea_description}
Target Region: {region}

List 3-5 relevant competitors that exist in this space. Include their company name, website (if known, or leave empty), and a brief description of what they do."""
    
    # Try Groq API first
    result = call_groq_api(prompt, system_message)
    
    if result and isinstance(result, dict) and 'competitors' in result:
        print("✅ Using Groq AI response for competitor discovery")
        return result['competitors']
    else:
        print("⚠️ Fallback to random data for competitor discovery")
        # Fallback to random competitors based on industry
        competitor_lists = {
            "FinTech": [
                {"name": "Stripe", "website": "stripe.com", "description": "Payment processing platform for online businesses"},
                {"name": "PayPal", "website": "paypal.com", "description": "Digital payments and money transfers"},
                {"name": "Square", "website": "square.com", "description": "Financial services and merchant services"},
                {"name": "Plaid", "website": "plaid.com", "description": "Financial data connectivity platform"},
                {"name": "Revolut", "website": "revolut.com", "description": "Digital banking and financial services"}
            ],
            "HealthTech": [
                {"name": "Teladoc Health", "website": "teladoc.com", "description": "Telehealth and virtual healthcare services"},
                {"name": "Amwell", "website": "amwell.com", "description": "Telemedicine platform"},
                {"name": "Doximity", "website": "doximity.com", "description": "Digital platform for medical professionals"},
                {"name": "Zocdoc", "website": "zocdoc.com", "description": "Healthcare appointment booking platform"}
            ],
            "EdTech": [
                {"name": "Coursera", "website": "coursera.org", "description": "Online learning platform with courses from top universities"},
                {"name": "Udemy", "website": "udemy.com", "description": "Online learning marketplace"},
                {"name": "Khan Academy", "website": "khanacademy.org", "description": "Free educational platform"},
                {"name": "Duolingo", "website": "duolingo.com", "description": "Language learning platform"}
            ],
            "AI/ML": [
                {"name": "OpenAI", "website": "openai.com", "description": "AI research and deployment company"},
                {"name": "Anthropic", "website": "anthropic.com", "description": "AI safety and research company"},
                {"name": "Cohere", "website": "cohere.com", "description": "Enterprise AI platform"},
                {"name": "Hugging Face", "website": "huggingface.co", "description": "AI model hub and platform"}
            ]
        }
        
        # Get competitors for the industry or default
        competitors = competitor_lists.get(industry, competitor_lists["AI/ML"])
        # Return 3-5 random competitors
        return random.sample(competitors, min(5, len(competitors)))


def analyze_skills_gap_with_ai(skills, startup_type, experience):
    """Analyze skills gap using Groq API"""
    
    system_message = """You are a startup skills analyst. Respond ONLY in JSON format with this structure:
{
    "required_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "current_skills": ["User skill 1", "User skill 2"],
    "gap_skills": ["Missing skill 1", "Missing skill 2"],
    "recommendations": ["Actionable recommendation 1", "Recommendation 2", "Recommendation 3"],
    "skill_areas": [
        {"area": "Technical", "required": 80, "current": 60, "importance": "High"},
        {"area": "Marketing", "required": 75, "current": 40, "importance": "Critical"}
    ],
    "readiness_score": 50-100,
    "top_gaps": ["Top gap 1", "Top gap 2"],
    "strengths": ["Strength 1", "Strength 2"],
    "learning_path": [
        {"area": "Skill Area", "resources": [{"name": "Course Name", "platform": "Platform", "duration": "X months"}]}
    ],
    "timeline_projection": [
        {"month": 0, "score": 50, "milestone": "Starting Point"},
        {"month": 3, "score": 65, "milestone": "Core skills acquired"},
        {"month": 6, "score": 80, "milestone": "Ready for launch"}
    ],
    "recommended_roles": [
        {"role": "Role Name", "priority": "High/Medium/Low", "timeline": "Immediate/1-3 months/3-6 months", "reason": "Why this role is needed"}
    ]
}"""
    
    prompt = f"""Analyze skills gap for a {startup_type} startup. The founder has {experience} experience and current skills: {skills}. Provide detailed skills assessment."""
    
    # Try Groq API first
    result = call_groq_api(prompt, system_message)
    
    if result and isinstance(result, dict) and 'readiness_score' in result:
        print("✅ Using Groq AI response for skills analysis")
        return result
    else:
        print("⚠️ Fallback to random data for skills analysis")
        skill_list = [s.strip() for s in skills.split(',') if s.strip()][:5]
        score = random.randint(50, 85)
        
        return {
            "required_skills": ["Technical Development", "Marketing", "Sales", "Product Management", "Leadership"],
            "current_skills": skill_list,
            "gap_skills": ["Marketing", "Sales"],
            "recommendations": [
                "Take a digital marketing course",
                "Find a co-founder with sales experience",
                "Join a startup accelerator",
                "Network with industry experts"
            ],
            "skill_areas": [
                {"area": "Technical", "required": 80, "current": random.randint(50, 75), "importance": "High"},
                {"area": "Marketing", "required": 75, "current": random.randint(30, 55), "importance": "Critical"},
                {"area": "Sales", "required": 70, "current": random.randint(35, 60), "importance": "Critical"},
                {"area": "Product", "required": 75, "current": random.randint(40, 65), "importance": "High"},
                {"area": "Leadership", "required": 85, "current": random.randint(50, 70), "importance": "High"}
            ],
            "readiness_score": score,
            "top_gaps": ["Marketing Strategy", "Sales Leadership"],
            "strengths": skill_list[:2] if skill_list else ["Domain Knowledge"],
            "learning_path": [
                {
                    "area": "Marketing",
                    "resources": [
                        {"name": "Digital Marketing Course", "platform": "Coursera", "duration": "2 months"}
                    ]
                },
                {
                    "area": "Sales",
                    "resources": [
                        {"name": "Sales Training", "platform": "LinkedIn Learning", "duration": "1 month"}
                    ]
                }
            ],
            "timeline_projection": [
                {"month": 0, "score": score, "milestone": "Starting Point"},
                {"month": 3, "score": score + 10, "milestone": "Core skills acquired"},
                {"month": 6, "score": score + 20, "milestone": "Ready for launch"}
            ],
            "recommended_roles": [
                {"role": "Marketing Lead", "priority": "High", "timeline": "Immediate", "reason": "Marketing expertise needed"},
                {"role": "Sales Director", "priority": "High", "timeline": "1-3 months", "reason": "Sales experience critical"},
                {"role": "Technical Co-founder", "priority": "Medium", "timeline": "3-6 months", "reason": "Technical leadership"}
            ]
        }