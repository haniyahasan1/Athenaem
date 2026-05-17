'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Welcome.module.css';

export default function WelcomePage() {
  const router = useRouter();
  const [showTitle, setShowTitle] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 400);
    const t2 = setTimeout(() => setShowSub(true), 1200);
    const t3 = setTimeout(() => setShowRedirect(true), 2000);
    const t4 = setTimeout(() => router.push('/account'), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [router]);

  return (
    <main className={styles.page}>
      <h1 className={`${styles.title} ${showTitle ? styles.visible : ''}`}>
        Congratulations 🎉
      </h1>
      <p className={`${styles.sub} ${showSub ? styles.visible : ''}`}>
        You&apos;re all set. Every week, a great read will find its way to you — chosen just for you, from fields that will genuinely surprise you.
      </p>
      <p className={`${styles.redirect} ${showRedirect ? styles.visible : ''}`}>
        Please wait to be redirected...
      </p>
    </main>
  );
}
