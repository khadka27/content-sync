import Link from 'next/link';
import {
  Trash2,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Mail,
  RefreshCw,
  Lock,
  FileText,
  UserX,
  HelpCircle,
} from 'lucide-react';

export const metadata = {
  title: 'User Data Deletion Instructions | Content Sync',
  description:
    'Instructions and request form for deleting your account, personal data, and Facebook/social media app connections from Content Sync.',
};

export default function DataDeletionPage() {
  const lastUpdated = 'August 3, 2026';

  const steps = [
    {
      step: '1',
      title: 'Remove Content Sync from Facebook / Meta',
      icon: UserX,
      content: `If you connected your Facebook Account or Facebook Pages to Content Sync, you can revoke access at any time:
1. Go to your Facebook profile or page settings.
2. Navigate to Settings & Privacy → Settings → Apps and Websites.
3. Find Content Sync in the active apps list.
4. Click Remove to revoke all permissions and access tokens instantly.`,
    },
    {
      step: '2',
      title: 'Delete Data via Content Sync Dashboard',
      icon: Trash2,
      content: `You can delete your connected social accounts, workspace data, or full user account directly inside Content Sync:
1. Log into your Content Sync account.
2. Go to Dashboard → Settings → Account & Security.
3. Click "Disconnect Social Accounts" to remove stored access tokens immediately, or click "Delete Account & All Workspaces" to purge all stored data.`,
    },
    {
      step: '3',
      title: 'Submit an Automated / Manual Deletion Request',
      icon: Mail,
      content: `If you no longer have access to your account or wish to request manual erasure of your data under GDPR/CCPA:
- Email our Data Protection Officer at privacy@dailyworkreport.com with the subject line "Data Deletion Request".
- Include your registered email address and registered Facebook User ID / Page ID.
- Our security team will process your deletion request within 48 hours and send a confirmation code.`,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500 selection:text-white">
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-4 h-4" />
            <span>Facebook & GDPR Compliance</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            User Data Deletion Instructions
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Content Sync respects your data privacy rights. Follow the steps below to revoke social media connections or request complete deletion of your account and personal data.
          </p>
          <div className="pt-2 text-xs text-zinc-500 font-mono">
            Last Updated: {lastUpdated} &bull; GDPR, CCPA & Meta Platform Compliant
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* What Data We Store & What Gets Deleted */}
        <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Lock className="w-6 h-6 text-rose-400" />
            What Happens When You Request Data Deletion?
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            According to Facebook / Meta Platform rules and international data protection laws (GDPR & CCPA), when you request data deletion or remove Content Sync from your Facebook account:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <h3 className="font-bold text-rose-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Data Permanently Purged
              </h3>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>Facebook & Instagram OAuth tokens</li>
                <li>Connected social account identifiers & page tokens</li>
                <li>Scraped content logs & AI generation drafts</li>
                <li>User profile, name, email & workspace associations</li>
                <li>Scheduled post queues & custom brand settings</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Processing Timeline
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                OAuth access tokens and Facebook page connections are revoked immediately upon disconnection. Full database account erasure is completed within 30 days of request receipt.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Step-by-Step Deletion Instructions
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 space-y-4 hover:border-zinc-700/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-zinc-400" />
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    </div>
                  </div>
                  <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line font-sans pl-13">
                    {item.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact DPO & Deletion Form */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-rose-950/20 via-zinc-900/80 to-zinc-950 border border-rose-900/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Manual Data Deletion Contact</h3>
              <p className="text-xs text-zinc-400">Reach out directly to our compliance officer</p>
            </div>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            If you need assistance verifying data deletion or have specific inquiries regarding your Facebook login data, please email our Privacy Team at:
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <a
              href="mailto:privacy@dailyworkreport.com?subject=Data%20Deletion%20Request"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm text-center shadow-lg shadow-rose-600/20 transition"
            >
              Email privacy@dailyworkreport.com
            </a>
            <Link
              href="/privacy"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm text-center border border-zinc-700 transition"
            >
              View Privacy Policy
            </Link>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-xs text-zinc-400 space-y-2">
          <p>&copy; {new Date().getFullYear()} Content Sync. All rights reserved.</p>
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
      </main>
    </div>
  );
}
