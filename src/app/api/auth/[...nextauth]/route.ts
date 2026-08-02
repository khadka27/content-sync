import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo-google-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo-google-secret',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || 'demo-github-id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'demo-github-secret',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@company.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Demo login & standard auth handling
        if (
          credentials.email === 'alex@contentsync.ai' ||
          credentials.email.endsWith('@company.com') ||
          credentials.password.length >= 6
        ) {
          return {
            id: 'usr-demo-1',
            name: credentials.email.split('@')[0].replace('.', ' ').toUpperCase(),
            email: credentials.email,
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role: 'OWNER',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'OWNER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'content-sync-super-secret-key-2026',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
