'use client';

import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subject, message }),
    });

    if (res.ok) {
      setStatus('sent');
      setName('');
      setSubject('');
      setMessage('');
    } else {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.contactForm}>
      <input
        type="text"
        placeholder="Your name"
        className={styles.input}
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        className={styles.input}
        value={subject}
        onChange={e => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Your message..."
        className={styles.textarea}
        rows={5}
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />
      {status === 'sent' && (
        <p style={{ fontFamily: 'Times New Roman', fontSize: '0.9rem', color: '#555' }}>
          Message sent — thanks for reaching out.
        </p>
      )}
      {status === 'error' && (
        <p style={{ fontFamily: 'Times New Roman', fontSize: '0.9rem', color: '#c00' }}>
          Something went wrong. Try again.
        </p>
      )}
      <button type="submit" disabled={status === 'sending'} className={styles.submitBtn}>
        {status === 'sending' ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
