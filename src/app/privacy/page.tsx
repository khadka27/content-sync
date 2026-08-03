import Link from 'next/link';
import {
  Shield,
  Lock,
  ArrowLeft,
  Eye,
  Database,
  Share2,
  Cookie,
  UserCheck,
  Globe,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Content Sync',
  description: 'Privacy Policy and Data Protection standards for Content Sync Multi-Workspace Social Automation Platform.',
};

export default function PrivacyPage() {
  const lastUpdated = 'August 2, 2026';

  const sections = [
    {
      id: 'overview',
      title: '1. Overview & Commitment to Privacy',
      icon: Shield,
      content: `At Content Sync ("Service", "We", "Us", or "Our"), we take your privacy and data security seriously. This Privacy Policy explains how we collect, use, store, process, and protect your personal information and business data when you use our multi-workspace social automation platform.

By creating an account or accessing our services, you consent to the data collection and usage practices described in this policy.`,
    },
    {
      id: 'information-collected',
      title: '2. Information We Collect',
      icon: Database,
      content: `We collect several categories of information to operate, optimize, and secure Content Sync:

- Account & Profile Data: Full name, email address, company name, profile avatar, billing preferences, and encrypted password credentials.
- Workspace & Integration Data: Domain URLs, RSS feed links, connected social media account identifiers, and OAuth access tokens (Facebook Pages, Instagram, X, LinkedIn, Threads, Pinterest, Telegram, Discord).
- Content & Prompt Logs: URLs scraped for content extraction, AI generation prompts, drafted posts, carousel slides, script templates, and publishing schedules.
- System & Usage Analytics: IP address, browser type, device information, operating system, page response times, and feature usage telemetry collected via essential session cookies and performance logs.`,
    },
    {
      id: 'how-we-use-data',
      title: '3. How We Use Your Information',
      icon: Eye,
      content: `Your data is processed strictly for legitimate business and operational purposes:

- Providing Core Functionality: Automating RSS feed polling, scraping user-specified URLs, generating AI social posts, scheduling, and publishing to your connected social channels.
- OAuth Token Encryption: Encrypting and managing third-party social media access tokens to execute scheduled posts on your behalf.
- Service Optimization & Security: Improving AI post generation accuracy, monitoring system performance, preventing fraud or abuse, and enforcing account rate limits.
- Transactional Communications: Sending account setup confirmations, security alerts, billing invoices, and feature updates.`,
    },
    {
      id: 'third-party-sharing',
      title: '4. Third-Party Data Sharing & AI Processors',
      icon: Share2,
      content: `We do NOT sell, rent, or trade your personal information or content logs to third-party advertisers. We share data only with trusted service providers necessary to operate the platform:

- Generative AI Partners: Input prompts and scraped article text are submitted to AI service providers (such as OpenAI and Anthropic) via secure zero-data-retention Enterprise APIs strictly for generating post variations. Your data is NOT used to train public foundational models.
- Social Media Network APIs: Post text, imagery, and schedule parameters are transmitted to social networks (Meta, X, LinkedIn, etc.) as requested by your automated workflows.
- Payment & Cloud Infrastructure: Credit card processing is handled securely via PCI-DSS compliant providers (Stripe). Data storage and database instances are hosted on secure, SOC2-certified cloud infrastructure (AWS / Vercel / Prisma).`,
    },
    {
      id: 'cookies',
      title: '5. Cookies & Tracking Technologies',
      icon: Cookie,
      content: `Content Sync utilizes essential cookies and local storage tokens to maintain authenticated sessions, store workspace preferences (such as light/dark mode and active workspace selection), and secure API interactions.

- Essential Cookies: Strictly necessary for login sessions, CSRF protection, and navigation security.
- Functional Storage: Preserves active workspace context and temporary post drafts.
- You can manage cookie preferences in your web browser settings; however, disabling essential cookies may impair core application features.`,
    },
    {
      id: 'security-retention',
      title: '6. Data Security & Storage Standards',
      icon: Lock,
      content: `We employ industry-standard administrative, physical, and technical safeguards to protect your data against unauthorized access, alteration, disclosure, or destruction:

- Encryption in Transit & Rest: All traffic is encrypted via TLS 1.3 (HTTPS), and sensitive credentials (such as OAuth tokens) are stored using AES-256 encryption.
- Access Controls: Role-based access controls (RBAC) ensure that team members within a workspace only access resources designated by the workspace owner.
- Data Retention: Account data is retained for as long as your subscription is active. Upon account deletion, all connected tokens, workspace configurations, and scheduled drafts are permanently purged within 30 days.`,
    },
    {
      id: 'privacy-rights',
      title: '7. Your Privacy Rights (GDPR, CCPA/CPRA)',
      icon: UserCheck,
      content: `Depending on your location, you possess specific statutory rights regarding your personal data under the General Data Protection Regulation (GDPR) or California Consumer Privacy Act (CCPA/CPRA):

- Right to Access & Portability: Request a copy of the personal data and workspace content stored in your account.
- Right to Rectification: Correct inaccurate or incomplete profile and organization details.
- Right to Erasure ("Right to be Forgotten"): Request permanent deletion of your account and associated social connection tokens.
- Right to Withdraw Consent: Revoke social media OAuth connections at any time directly through Content Sync settings or your social media provider's account security page.`,
    },
    {
      id: 'international-transfers',
      title: '8. International Data Transfers',
      icon: Globe,
      content: `Content Sync operates globally. Information collected from users in the European Economic Area (EEA), United Kingdom, or other regions may be transferred to and processed on secure servers located in the United States or other countries with equivalent data protection standards under standard contractual clauses (SCCs).`,
    },
    {
      id: 'contact-privacy',
      title: '9. Contact Our Data Protection Officer (DPO)',
      icon: HelpCircle,
      content: `If you wish to exercise your privacy rights, request data deletion, or submit questions regarding this Privacy Policy, please contact our Data Protection Officer:

- Email: privacy@contentsync.ai
- Security Portal: https://contentsync.ai/security
- Postal Address: Content Sync Inc., Attn: Privacy Officer, Legal Dept.`,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Header Banner */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                CS
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-white">
                Content Sync
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative border-b border-zinc-800/60 bg-gradient-to-b from-zinc-900/80 to-zinc-950 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-4 h-4" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Learn how Content Sync protects your data, handles social media tokens, respects user privacy rights, and ensures enterprise security.
          </p>
          <div className="pt-2 text-xs text-zinc-500 font-mono">
            Last Updated: {lastUpdated} &bull; GDPR & CCPA Compliant
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Table of Contents Sidebar */}
        <aside className="lg:col-span-1 space-y-4 hidden lg:block sticky top-28 h-fit">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Privacy Outline
            </h3>
            <nav className="space-y-1 text-xs">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block py-1.5 px-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition truncate"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-xs space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Privacy Commitment
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              We never sell your data or use your private workspace posts for public AI training.
            </p>
            <a
              href="mailto:privacy@contentsync.ai"
              className="text-emerald-400 font-semibold underline block hover:text-emerald-300"
            >
              privacy@contentsync.ai
            </a>
          </div>
        </aside>

        {/* Privacy Sections List */}
        <section className="lg:col-span-3 space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={section.id}
                className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 space-y-4 hover:border-zinc-700/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                  {section.content}
                </div>
              </div>
            );
          })}

          {/* Bottom Footer Notice */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-xs text-zinc-400 space-y-2">
            <p>&copy; {new Date().getFullYear()} Content Sync Inc. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 text-zinc-500 pt-1">
              <Link href="/privacy" className="hover:text-zinc-300 underline">
                Privacy Policy
              </Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-zinc-300 underline">
                Terms of Service
              </Link>
              <span>&bull;</span>
              <Link href="/data-deletion" className="hover:text-zinc-300 underline">
                Data Deletion
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
