// The 54 AI sub-niches of the FreeSerp `ai_categories` taxonomy.
// The API has no facet endpoint, so the list is kept here and counts are fetched per niche.

export type Niche = {
  slug: string
  name: string
  blurb: string
}

export const NICHES: Niche[] = [
  { slug: "ai-agents", name: "AI Agents & Autonomous", blurb: "Agents that plan and carry out multi-step tasks on their own." },
  { slug: "ai-automation", name: "AI Automation & Workflows", blurb: "Tools that chain apps and AI steps into automated workflows." },
  { slug: "code-dev-tools", name: "Code & Dev Tools", blurb: "Developer tooling: code generation, testing, review and DevOps." },
  { slug: "data-analytics", name: "Data & Analytics", blurb: "AI for dashboards, BI, data cleaning and insight discovery." },
  { slug: "ai-infrastructure", name: "AI Infrastructure & API", blurb: "Model hosting, inference APIs, GPUs, vector stores and MLOps." },
  { slug: "research-science", name: "Research & Science", blurb: "AI for scientific research, papers, labs and academia." },
  { slug: "ai-website-builder", name: "AI Website Builder", blurb: "Generate and launch websites from a prompt." },
  { slug: "marketing-ads", name: "Marketing & Ads", blurb: "Campaign planning, ad creatives and performance marketing with AI." },
  { slug: "seo-content", name: "SEO & Content", blurb: "Keyword research, content optimization and search visibility." },
  { slug: "productivity", name: "Productivity", blurb: "Personal and team productivity: notes, tasks, calendars, meetings." },
  { slug: "no-code-app-builder", name: "No-code / App Builder", blurb: "Build apps and internal tools without writing code." },
  { slug: "ai-search", name: "AI Search & Answers", blurb: "Answer engines and AI-powered search experiences." },
  { slug: "image-generation", name: "Image Generation", blurb: "Text-to-image models and creative image tools." },
  { slug: "customer-support", name: "Customer Support", blurb: "Support bots, helpdesk copilots and ticket automation." },
  { slug: "education-tutoring", name: "Education & Tutoring", blurb: "AI tutors, course builders and learning platforms." },
  { slug: "ai-chatbot", name: "AI Chatbot & Assistant", blurb: "General-purpose chat assistants and embeddable chatbots." },
  { slug: "design-ui", name: "Design & UI", blurb: "AI for UI design, mockups, prototyping and design systems." },
  { slug: "video-generation", name: "Video Generation", blurb: "Text-to-video, AI presenters and generated clips." },
  { slug: "finance-trading", name: "Finance & Trading", blurb: "AI for investing, trading signals, accounting and fintech." },
  { slug: "e-commerce", name: "E-commerce", blurb: "AI for online stores: product content, pricing and shopping assistants." },
  { slug: "sales-crm", name: "Sales & CRM", blurb: "Sales copilots, CRM enrichment and pipeline automation." },
  { slug: "healthcare-medical", name: "Healthcare & Medical", blurb: "Clinical tools, medical scribes and health assistants." },
  { slug: "voice-tts", name: "Voice & Text-to-Speech", blurb: "Speech synthesis, voice agents and audio voices." },
  { slug: "writing-content", name: "Writing & Content", blurb: "AI writing assistants for articles, docs and long-form text." },
  { slug: "lead-gen-outreach", name: "Lead Gen & Outreach", blurb: "Prospecting, enrichment and automated cold outreach." },
  { slug: "security-moderation", name: "Security & Moderation", blurb: "Threat detection, fraud prevention and content moderation." },
  { slug: "directory-aggregator", name: "Directory / Aggregator", blurb: "Catalogs and directories of AI tools and resources." },
  { slug: "knowledge-rag", name: "Knowledge & RAG", blurb: "Chat with your documents: retrieval-augmented knowledge bases." },
  { slug: "social-media", name: "Social Media", blurb: "Post generation, scheduling and social growth tools." },
  { slug: "llm-prompt-tools", name: "LLM & Prompt Tools", blurb: "Prompt engineering, evaluation and LLM observability." },
  { slug: "recruiting-hr", name: "Recruiting & HR", blurb: "Hiring, candidate screening and HR automation." },
  { slug: "other-ai", name: "Other AI", blurb: "AI products that don't fit a single niche." },
  { slug: "real-estate", name: "Real Estate", blurb: "Property search, listings, valuation and agent tools." },
  { slug: "document-pdf", name: "Document & PDF AI", blurb: "Read, summarize, edit and convert documents and PDFs." },
  { slug: "copywriting", name: "Copywriting & Marketing", blurb: "Ad copy, landing page text and marketing messages." },
  { slug: "legal", name: "Legal", blurb: "Contract review, legal research and compliance tools." },
  { slug: "video-editing", name: "Video Editing", blurb: "AI-assisted cutting, captions, clipping and enhancement." },
  { slug: "coding-assistant", name: "Coding Assistant", blurb: "Pair-programming assistants inside the editor." },
  { slug: "image-editing", name: "Image Editing & Enhancement", blurb: "Retouching, upscaling, inpainting and photo enhancement." },
  { slug: "audio-music", name: "Audio & Music", blurb: "Music generation, mastering and audio production." },
  { slug: "3d-modeling", name: "3D & Modeling", blurb: "Generate and edit 3D models, scenes and assets." },
  { slug: "logo-branding", name: "Logo & Branding", blurb: "Logo makers and brand identity generators." },
  { slug: "email-ai", name: "Email AI", blurb: "Inbox assistants, email drafting and triage." },
  { slug: "ai-avatars", name: "AI Avatars & Headshots", blurb: "Profile photos, headshots and personal avatars." },
  { slug: "conversational-ai", name: "Conversational AI", blurb: "Platforms for building dialogue systems and voice bots." },
  { slug: "transcription", name: "Transcription & Speech-to-Text", blurb: "Turn audio and meetings into accurate text." },
  { slug: "ocr-extraction", name: "OCR & Extraction", blurb: "Extract structured data from scans, invoices and forms." },
  { slug: "summarization", name: "Summarization", blurb: "Condense articles, videos and meetings into key points." },
  { slug: "ai-companion", name: "AI Companion & Character", blurb: "Character chat, companions and role-play apps." },
  { slug: "travel", name: "Travel", blurb: "Trip planning, itineraries and travel booking assistants." },
  { slug: "presentations", name: "Presentations & Slides", blurb: "Generate slide decks and presentations from text." },
  { slug: "voice-cloning", name: "Voice Cloning", blurb: "Clone and reuse a specific person's voice." },
  { slug: "fitness-wellness", name: "Fitness & Wellness", blurb: "Workout plans, coaching and wellbeing apps." },
  { slug: "background-removal", name: "Background Removal", blurb: "Cut out subjects and replace image backgrounds." },
]

const bySlug = new Map(NICHES.map((n) => [n.slug, n]))
const byName = new Map(NICHES.map((n) => [n.name, n]))

export function getNicheBySlug(slug: string) {
  return bySlug.get(slug)
}

export function getNicheByName(name: string) {
  return byName.get(name)
}
