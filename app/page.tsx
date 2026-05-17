import Link from 'next/link';
import HeroSection from '../components/HeroSection';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <main>
      <HeroSection />

      <section className={styles.content}>
        <div id="about" className={styles.about}>
          <h2 className={styles.aboutTitle}>What is Athenaem?</h2>
          <p className={styles.aboutText}>
            Most of us want to read more, learn more, understand more. We just never do.
            This isn&apos;t because we&apos;re lazy, but because the internet is loud, and social
            media seems like the easier thing to do.
            <br /><br />
            Athenaem fixes that with one text a week.
            <br /><br />
            Tell us what you&apos;re curious about. We&apos;ll handle the rest — sifting through
            thousands of articles to find the one worth your time based on your preferences
            and fields of study, then sending it straight to your phone with just enough
            context to make you <em>need</em> to read it.
            <br /><br />
            No algorithms fighting for your attention. No digest to skim and forget.
            Just one great read, chosen for you, delivered simply.
          </p>
        </div>

        <div className={styles.authButtons}>
          <Link href="/login?mode=signup" className={styles.btnPrimary}>Sign Up</Link>
          <Link href="/login" className={styles.btnSecondary}>Log In</Link>
        </div>

        <div id="contact" className={styles.contact}>
          <h2 className={styles.contactTitle}>Get in Touch</h2>
          <form className={styles.contactForm}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className={styles.input}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className={styles.input}
            />
            <textarea
              name="message"
              placeholder="Your message..."
              className={styles.textarea}
              rows={5}
            />
            <button type="submit" className={styles.submitBtn}>Send</button>
          </form>
        </div>
      </section>
    </main>
  );
}
