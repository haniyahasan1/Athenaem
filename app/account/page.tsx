'use client';

import { useEffect, useState } from 'react';
import styles from '../../styles/Account.module.css';

type Article = {
  id: string;
  title: string;
  url: string;
  source: string;
  sent_at: string;
  articles: {
    title: string;
    url: string;
    source: string;
  };
};

type User = {
  phone: string;
  name: string | null;
  push_count: number;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pushMsg, setPushMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-profile')
      .then(r => r.json())
      .then(data => {
        setUser(data.user);
        setArticles(data.articles ?? []);
        setName(data.user?.name ?? '');
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePush = async () => {
    setPushing(true);
    setPushMsg('');
    const res = await fetch('/api/push-article', { method: 'POST' });
    const data = await res.json();
    setPushing(false);
    if (res.ok) {
      setPushMsg(`Article sent! ${data.remaining} push${data.remaining === 1 ? '' : 'es'} remaining.`);
      setTimeout(() => setPushMsg(''), 5000);
    } else {
      setPushMsg(data.error ?? 'Something went wrong.');
      setTimeout(() => setPushMsg(''), 5000);
    }
  };

  const handleSaveName = async () => {
    setSaving(true);
    const res = await fetch('/api/save-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setEditing(false);
      setUser(prev => prev ? { ...prev, name } : prev);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const data = await res.json();
      alert(data.error ?? 'Failed to save name.');
    }
  };

  if (loading) return <main className={styles.page} />;

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          <p className={styles.sidebarLabel}>Phone</p>
          <p className={styles.phone}>{user?.phone ?? '—'}</p>

          <p className={styles.sidebarLabel} style={{ marginTop: '2rem' }}>Name</p>
          {editing ? (
            <div className={styles.nameEdit}>
              <input
                className={styles.nameInput}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
              />
              <div className={styles.nameActions}>
                <button className={styles.saveBtn} onClick={handleSaveName} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button className={styles.cancelBtn} onClick={() => { setEditing(false); setName(user?.name ?? ''); }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.nameRow}>
              <p className={`${styles.nameDisplay} ${!user?.name ? styles.namePlaceholder : ''}`}>
                {user?.name ?? 'First Name'}
              </p>
              <button className={styles.editBtn} onClick={() => setEditing(true)} title="Edit name">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
          )}
          {saved && <p className={styles.savedMsg}>Saved!</p>}

          <div style={{ marginTop: '2.5rem' }}>
            <p className={styles.sidebarLabel}>Push Article</p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', marginBottom: '0.75rem' }}>
              {5 - (user?.push_count ?? 0)} of 5 pushes remaining
            </p>
            <button
              className={styles.saveBtn}
              onClick={handlePush}
              disabled={pushing || (user?.push_count ?? 0) >= 5}
            >
              {pushing ? 'Sending...' : 'Send me an article'}
            </button>
            {pushMsg && <p className={styles.savedMsg}>{pushMsg}</p>}
          </div>
        </div>
      </aside>

      <section className={styles.main}>
        <h1 className={styles.title}>Articles Sent</h1>

        {articles.length === 0 ? (
          <p className={styles.empty}>No articles to display yet — check back after your first weekly digest.</p>
        ) : (
          <div className={styles.articleGrid}>
            {articles.map(row => (
              <a
                key={row.id}
                href={row.articles.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.articleCard}
              >
                <p className={styles.articleTitle}>{row.articles.title}</p>
                <p className={styles.articleSource}>{row.articles.source}</p>
                <p className={styles.articleDate}>
                  Sent {new Date(row.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <span className={styles.articleLink}>Read article →</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
