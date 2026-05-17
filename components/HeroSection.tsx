'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const steps = [
  { number: '01', text: 'Sign up in seconds — no password, just your phone number.' },
  { number: '02', text: 'Select your field of study and the topics that intrigue you.' },
  { number: '03', text: 'Receive weekly articles from outside your field, curated to expand how you think.' },
];

export default function HeroSection() {
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [visible, setVisible] = useState([false, false, false]);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const phoneticTimer = setTimeout(() => setShowPhonetic(true), 1000);
    const timers = steps.map((_, i) =>
      setTimeout(() => {
        setVisible(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 2500 + i * 600)
    );
    const btnTimer = setTimeout(() => setShowBtn(true), 2500 + steps.length * 600);
    return () => { clearTimeout(phoneticTimer); timers.forEach(clearTimeout); clearTimeout(btnTimer); };
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <em
          className={styles.phonetic}
          style={{ opacity: showPhonetic ? 1 : 0 }}
        >
          (a • thuh • nee • um)
        </em>
        <h1 className={styles.title}>Athenaem</h1>
        <p className={styles.tagline}>Think Deeper.</p>
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`${styles.step} ${visible[i] ? styles.stepVisible : ''}`}
            >
              <span className={styles.stepNumber}>{step.number}</span>
              <span className={styles.stepText}>{step.text}</span>
            </div>
          ))}
          <Link
            href="/login?mode=signup"
            className={styles.heroSignUp}
            style={{
              opacity: showBtn ? 1 : 0,
              transform: showBtn ? 'translateY(0)' : 'translateY(10px)',
            }}
          >
            Sign Up Now
          </Link>
        </div>
      </div>
      <div className={styles.scrollHint}>↓</div>
    </section>
  );
}
