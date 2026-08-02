import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, title, content, tone, platforms, websiteName } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    const selectedTone = tone || 'PROFESSIONAL';

    if (action === 'generate_scripts') {
      return NextResponse.json({
        success: true,
        data: {
          reelScript: `🎬 [INSTAGRAM REEL SCRIPT]\n\n[HOOK (0-3s)]: "Stop scrolling! Here's why ${title || 'this strategy'} will change your workflow in 2026."\n\n[SCENE 1 (3-15s)]: Show screen capture of modern dashboard.\nVoiceover: "${content ? content.slice(0, 100) : 'Engineers are leveraging multi-agent workflows to automate 80% of routine tasks.'}"\n\n[SCENE 2 (15-30s)]: Text overlay with 3 key points:\n1. Zero friction setup\n2. Real-time multi-platform sync\n3. High conversion output\n\n[CTA (30-45s)]: "Link in bio to test Content Sync for free today! 🔥"`,
          shortsScript: `⚡ [YOUTUBE SHORTS SCRIPT]\n\n[0-5s]: "Did you know ${title || 'AI automation'} can save you 15 hours every week?"\n\n[5-25s]: Fast-paced visual cut of analytics chart spiking upwards.\nNarration: "Instead of manually writing posts for X, LinkedIn, and Instagram, auto-convert your blog posts into high-engaging carousel slides and video scripts in 1 click."\n\n[25-60s]: "Drop a comment with your biggest growth challenge and subscribe for daily breakdowns!"`,
        },
      });
    }

    if (action === 'generate_carousel') {
      return NextResponse.json({
        success: true,
        data: {
          slides: [
            { slideNumber: 1, title: title || 'Mastering AI Workflows', subtitle: 'A step-by-step framework for 2026' },
            { slideNumber: 2, title: '1. Automated Scraper', text: 'Import any article URL and instantly extract high-value insights.' },
            { slideNumber: 3, title: '2. Multi-Tone Adaptation', text: `Switch seamlessly between Professional, Marketing, and Friendly tones.` },
            { slideNumber: 4, title: '3. Platform Custom Copies', text: 'Tailored copy formatting for X, LinkedIn, Threads, Instagram, and Discord.' },
            { slideNumber: 5, title: 'Summary & Key Action', text: 'Start automating your content workflow with Content Sync today!' },
          ],
        },
      });
    }

    if (action === 'generate_quote') {
      return NextResponse.json({
        success: true,
        data: {
          quoteText: `"${content ? content.slice(0, 120) : 'Automation isn’t about doing less work; it’s about creating more space for high-impact innovation.'}"`,
          author: websiteName || 'Content Sync',
          designPreset: 'Dark Glassmorphic Minimal',
        },
      });
    }

    // Default multi-platform copy generator
    const sampleTitle = title || 'Automating Social Growth in 2026';
    const sampleContent = content || 'Discover how multi-workspace AI platforms streamline content scheduling and analytics.';

    const toneEmojis: Record<string, string> = {
      PROFESSIONAL: '💼 📈',
      MARKETING: '🔥 🚀 💡',
      EDUCATIONAL: '📚 🎓 💡',
      FRIENDLY: '👋 🌱 ✨',
    };

    const prefix = toneEmojis[selectedTone] || '⚡';

    const platformCopies: Record<string, string> = {
      TWITTER: `${prefix} ${sampleTitle}\n\n${sampleContent.slice(0, 140)}...\n\n👇 Full breakdown:\nhttps://contentpilot.ai\n\n#AI #Automation #Growth2026`,
      LINKEDIN: `${prefix} ${sampleTitle}\n\nKey Insights for Industry Leaders:\n• ${sampleContent}\n• Streamlined multi-channel publishing\n• Real-time analytics tracking\n\nWhat is your team’s approach to content automation this year? Let's discuss in the comments below! 👇\n\n#SaaS #AI #Leadership #Marketing`,
      INSTAGRAM: `✨ ${sampleTitle} ✨\n\n${sampleContent}\n\n💡 Save this post for your next campaign!\n\n📲 Link in bio to try ContentPilot AI.\n\n. . .\n#ContentCreation #AIStudio #GrowthHacks #InstaDaily`,
      FACEBOOK: `${prefix} ${sampleTitle}\n\n${sampleContent}\n\nRead the full update on our blog today! Link in comments below. 👇`,
      THREADS: `${prefix} ${sampleTitle} - quick takeaway: ${sampleContent.slice(0, 120)}. What are your thoughts?`,
      PINTEREST: `📌 ${sampleTitle} | Step-by-Step Infographic & Guide for Digital Marketers`,
      TELEGRAM: `📢 [NEW POST] ${sampleTitle}\n\n${sampleContent}\n\n👉 Join the conversation in our community channel!`,
      DISCORD: `🚀 **New Content Drop**: **${sampleTitle}**\n\n> ${sampleContent}\n\nDiscuss this in #content-strategy!`,
    };

    return NextResponse.json({
      success: true,
      data: {
        summary: `AI Summary: ${sampleTitle} - ${sampleContent.slice(0, 80)}`,
        hashtags: ['#AI', '#Automation', '#SaaS', '#Growth2026'],
        cta: 'Try ContentPilot AI today!',
        seo: {
          title: `${sampleTitle} | ContentPilot AI`,
          description: sampleContent.slice(0, 150),
        },
        platformCopies,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'AI generation error.' }, { status: 500 });
  }
}
