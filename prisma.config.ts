import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://khadka27:postgres@localhost:5432/contentpilot_db',
  },
});
