import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../lib/supabase';
import styles from './Read.module.css';

export default async function ReadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (!article) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.source}>{article.field ?? article.source}</p>
        <h1 className={styles.title}>{article.title}</h1>
        {article.ai_hook && <p className={styles.hook}>{article.ai_hook}</p>}
        {article.abstract && article.abstract !== 'No abstract available.' && (
          <p className={styles.abstract}>{article.abstract}</p>
        )}
        <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.btn}>
          Read full article
        </a>
      </div>
    </div>
  );
}
