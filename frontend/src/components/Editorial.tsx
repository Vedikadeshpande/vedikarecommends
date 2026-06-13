'use client';

import ScrollReveal from './ScrollReveal';
import Waveform from './Waveform';

export default function Editorial() {
  return (
    <section className="editorial" id="editorial-section" aria-label="About vedikarecommends">
      <div className="container">
        <div className="editorial__inner">
          <div className="editorial__text">
            <ScrollReveal>
              <h2 className="editorial__headline">
                <em>vedikarecommends.</em> because someone has to.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="editorial__body">
                all songs are chosen by feeling <br />
                and confirmed by my 3am playlists.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.35}>
              <div className="editorial__accent-line" />
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right" delay={0.2} className="editorial__visual">
            <Waveform mood="romantic" color="#C4654A" opacity={0.25} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
