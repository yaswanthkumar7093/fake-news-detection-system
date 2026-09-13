import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

try {
  await sql`
    CREATE TABLE IF NOT EXISTS public.fake_news_analyses (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      input_text      TEXT NOT NULL,
      input_url       TEXT,
      verdict         VARCHAR(20) NOT NULL,
      composite_score INT NOT NULL,
      ml_score        INT,
      ling_score      INT,
      source_score    INT,
      indicators      JSONB DEFAULT '[]',
      analyzed_at     TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS fna_verdict_idx ON public.fake_news_analyses(verdict)`;
  await sql`CREATE INDEX IF NOT EXISTS fna_date_idx   ON public.fake_news_analyses(analyzed_at DESC)`;
  console.log('✅ fake_news_analyses table created successfully!');
} catch (e) {
  console.error('❌ Error:', e.message);
  process.exit(1);
}
