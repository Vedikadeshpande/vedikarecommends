'use client';

import ScrollReveal from './ScrollReveal';

export default function Footer() {
  return (
    <footer className="footer" id="footer-section" role="contentinfo">
      <div className="container">
        <div className="footer__inner">
          <ScrollReveal>
            <p className="footer__wordmark">vedikarecommends</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="footer__tagline">Made with love.</p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="footer__divider" />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <ul className="footer__links">
              <li>
                <a
                  href="https://github.com"
                  className="footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-github-link"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://open.spotify.com"
                  className="footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-spotify-link"
                >
                  Spotify
                </a>
              </li>
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <p className="footer__credit">
              Emotion-based music discovery — powered by NLP
            </p>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
}
