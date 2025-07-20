## Inspiration 
One of our team members, Aditya, hails from Newfoundland. He has been all over Newfoundland playing in badminton tournaments. He has seen the raw talent that kids from underrepresented communities possess, yet due to a lack of access to coaching, they struggle to transform their potential into actual performance. Due to recent advancements in AI, specifically multimodal agents, this problem can be supplemented through personalized coaching.  The team's creative vision was to create technology accessible enough that kids from the most remote communities can upload a video of them playing the sport they love and receive objective and actionable insights to improve their game. 

## What it does
Coach.ai is a personalized AI-leveraged software "coach" that analyzes sports videos and extracts strengths, weaknesses, opportunities and threats to transform into practical advice geared towards those without clear access to coaching/mentoring in their sport.

## How we built it
FastAPI (Python) Backend, Next.js (typescript) Frontend, Node.js(MongoDB), Tailwind CSS, Gemini API, Twelve Labs API

## Challenges we ran into
Fine-tuning prompt engineering posed a large challenge to our team. Initially, we intended to receive all the insights from the TwelveLabs API, however, we later decided to combine the TwelveLabs API with the Gemini API to create the effective insights our app delivers. Additional challenges: setting up MongoDB as first-time users, and Backend crashes with FastAPI CORS + middleware.

## Accomplishments that we're proud of
Our team is extremely proud of the UI/UX that we designed and implemented in our web app. Our product is meticulously designed to keep athletes engaged and connected to ensure they receive the insights to improve their game. Additional accomplishments: Broader implications of the web app, induction of APIs,  New exp for 2/3 of the team as first time hackers

## What we learned
API usage,  Leveraging multi-modal agents for benevolent purposes, Prompt Engineering, AI Workflows, Creating a Full Stack Web App, Conditional Styling

## What's next for coach.ai
Expanding into a community-centred website connecting users to help each other grow,  expanding to a more mobile-friendly app, and getting certified coaches and domain experts to conduct model fine-tuning (Human-in-the-loop) to strengthen the quality of insights.

## How to run
After installing all packages, run the following two commands:

frontend: npm run dev

backend: uvicorn main:app --reload --port 8000
