'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../../styles/Login.module.css';

type Phase = 'intro' | 'fading' | 'input';

const countryCodes = [
  { code: '+1', abbr: 'CAN' },
  { code: '+1', abbr: 'USA' },
  { code: '+44', abbr: 'GBR' },
  { code: '+61', abbr: 'AUS' },
  { code: '+64', abbr: 'NZL' },
  { code: '+353', abbr: 'IRL' },
  { code: '+33', abbr: 'FRA' },
  { code: '+49', abbr: 'DEU' },
  { code: '+39', abbr: 'ITA' },
  { code: '+34', abbr: 'ESP' },
  { code: '+31', abbr: 'NLD' },
  { code: '+32', abbr: 'BEL' },
  { code: '+41', abbr: 'CHE' },
  { code: '+43', abbr: 'AUT' },
  { code: '+351', abbr: 'PRT' },
  { code: '+46', abbr: 'SWE' },
  { code: '+47', abbr: 'NOR' },
  { code: '+45', abbr: 'DNK' },
  { code: '+358', abbr: 'FIN' },
  { code: '+48', abbr: 'POL' },
  { code: '+420', abbr: 'CZE' },
  { code: '+36', abbr: 'HUN' },
  { code: '+40', abbr: 'ROU' },
  { code: '+30', abbr: 'GRC' },
  { code: '+380', abbr: 'UKR' },
  { code: '+7', abbr: 'RUS' },
  { code: '+90', abbr: 'TUR' },
  { code: '+52', abbr: 'MEX' },
  { code: '+55', abbr: 'BRA' },
  { code: '+54', abbr: 'ARG' },
  { code: '+57', abbr: 'COL' },
  { code: '+56', abbr: 'CHL' },
  { code: '+51', abbr: 'PER' },
  { code: '+91', abbr: 'IND' },
  { code: '+92', abbr: 'PAK' },
  { code: '+880', abbr: 'BGD' },
  { code: '+81', abbr: 'JPN' },
  { code: '+82', abbr: 'KOR' },
  { code: '+86', abbr: 'CHN' },
  { code: '+65', abbr: 'SGP' },
  { code: '+60', abbr: 'MYS' },
  { code: '+63', abbr: 'PHL' },
  { code: '+66', abbr: 'THA' },
  { code: '+62', abbr: 'IDN' },
  { code: '+84', abbr: 'VNM' },
  { code: '+971', abbr: 'UAE' },
  { code: '+966', abbr: 'SAU' },
  { code: '+27', abbr: 'ZAF' },
  { code: '+234', abbr: 'NGA' },
  { code: '+254', abbr: 'KEN' },
  { code: '+233', abbr: 'GHA' },
  { code: '+212', abbr: 'MAR' },
];

function LoginForm() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedCode, setSelectedCode] = useState('+1|CAN');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') ?? 'login';

  useEffect(() => {
    if (mode === 'login') {
      setPhase('input');
      return;
    }
    const t1 = setTimeout(() => setPhase('fading'), 2000);
    const t2 = setTimeout(() => setPhase('input'), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const code = selectedCode.split('|')[0];
    const fullPhone = code + phone;

    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: fullPhone }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/verify?phone=${encodeURIComponent(data.phone)}&mode=${mode}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to send code. Try again.');
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={`${styles.intro} ${phase === 'fading' || phase === 'input' ? styles.fadeOut : ''}`}>
        <h1 className={styles.heading}>Are you ready to think beyond your field?</h1>
        <p className={styles.sub}>Let&apos;s get you started.</p>
      </div>

      <div className={`${styles.inputSection} ${phase === 'input' ? styles.fadeIn : ''}`}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Enter your phone number:</label>
          <div className={styles.phoneRow}>
            <select
              value={selectedCode}
              onChange={e => setSelectedCode(e.target.value)}
              className={styles.countrySelect}
            >
              {countryCodes.map((c, i) => (
                <option key={i} value={`${c.code}|${c.abbr}`}>
                  {c.code} {c.abbr}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className={styles.phoneInput}
              autoFocus
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.continueBtn}>
            {loading ? 'Sending...' : 'Send Code →'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
