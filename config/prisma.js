const { PrismaClient } = require('@prisma/client');

const HARDCODED_DATABASE_URL = 'postgresql://postgres.azujccrmsbpdrcmeunza:easternborderasse@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require';
const HARDCODED_DIRECT_URL = 'postgresql://postgres:easternborderasse@db.azujccrmsbpdrcmeunza.supabase.co:5432/postgres?sslmode=require';

if (!process.env.DATABASE_URL && process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}

const databaseUrl = process.env.DATABASE_URL || HARDCODED_DATABASE_URL;
process.env.DIRECT_URL = process.env.DIRECT_URL || HARDCODED_DIRECT_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL (or DIRECT_URL) for Prisma');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

module.exports = prisma
