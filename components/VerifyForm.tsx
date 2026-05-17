'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/Verify.module.css';

export default function VerifyForm() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const mode = searchParams.get('mode') ?? 'login';

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) return;

    setLoading(true);
    setError('');

    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });

    if (res.ok) {
      const data = await res.json();
      if (mode === 'login' || !data.isNewUser) {
        router.push('/account');
      } else {
        router.push('/onboarding/interests');
      }
    } else {
      const data = await res.json();
      setError(data.error || 'Invalid code. Try again.');
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <h2 className={styles.heading}>Enter the code we sent you</h2>
      <p className={styles.sub}>Sent to {phone}</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.codeRow}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={styles.digitBox}
              autoFocus={i === 0}
            />
          ))}
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          disabled={loading || digits.join('').length < 6}
          className={styles.verifyBtn}
        >
          {loading ? 'Verifying...' : 'Verify →'}
        </button>
      </form>
    </main>
  );
}
