'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Navbar.module.css';

type Me = { name: string | null; phone: string } | null;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<Me>(undefined as unknown as Me);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(setMe);
  }, []);

  const label = me?.name ?? me?.phone ?? null;

  return (
    <nav className={styles.nav}>
      <div className={styles.links}>
        <Link href="/" className={styles.link}>Home</Link>
        <Link href="/#about" className={styles.link}>About</Link>
        <Link href="/#contact" className={styles.link}>Contact</Link>
      </div>

      <div className={styles.right}>
        <span className={styles.divider}>|</span>
        {label ? (
          <div className={styles.dropdown}>
            <button className={styles.dropdownTrigger} onClick={() => setOpen(!open)}>
              {label} <span className={styles.caret}>{open ? '▴' : '▾'}</span>
            </button>
            {open && (
              <div className={styles.dropdownMenu}>
                <Link href="/account" className={styles.dropdownItem} onClick={() => setOpen(false)}>
                  My Account
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.dropdown}>
            <button className={styles.dropdownTrigger} onClick={() => setOpen(!open)}>
              Account <span className={styles.caret}>{open ? '▴' : '▾'}</span>
            </button>
            {open && (
              <div className={styles.dropdownMenu}>
                <Link href="/login?mode=login" className={styles.dropdownItem} onClick={() => setOpen(false)}>
                  Log In
                </Link>
                <Link href="/login?mode=signup" className={styles.dropdownItem} onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
