"use client";

import { useMemo, useState } from "react";

type Memory = {
  chapter: string;
  year: string;
  date: string;
  city: string;
  title: string;
  subtitle: string;
  note: string;
  favorite: string;
  before: string;
  after: string;
  tone: "violet" | "rose" | "blue" | "gold";
};

const memories: Memory[] = [
  {
    chapter: "04",
    year: "2026",
    date: "18 Apr",
    city: "Bangkok",
    title: "Neon Encore",
    subtitle: "A night written in violet light",
    note: "The crowd went quiet for one breath—then the whole arena became a sky of lightsticks.",
    favorite: "The final chorus, when every voice around me became part of the song.",
    before: "A folded ticket, silver details on the outfit, and that familiar nervous walk toward the arena doors.",
    after: "I left with ringing ears, a full camera roll, and the feeling that the night had ended too soon.",
    tone: "violet",
  },
  {
    chapter: "03",
    year: "2025",
    date: "02 Nov",
    city: "Singapore",
    title: "Lavender Night",
    subtitle: "Soft songs, loud hearts",
    note: "Some memories arrive as a flash. This one settled slowly, like color returning after the stage went dark.",
    favorite: "A quiet acoustic verse shared by thousands of people without a single phone in the air.",
    before: "Coffee near the venue, a last-minute banner, and a playlist repeated all afternoon.",
    after: "The walk back felt suspended between the concert and real life—too bright to be ordinary.",
    tone: "rose",
  },
  {
    chapter: "02",
    year: "2024",
    date: "27 Jul",
    city: "Ho Chi Minh City",
    title: "First Row of Stars",
    subtitle: "Closer than the screen ever felt",
    note: "For the first time, the stage did not feel far away. Every expression became part of the memory.",
    favorite: "The first wave from the stage and the split-second disbelief that followed.",
    before: "An early queue, summer heat, new friends, and a wristband kept carefully in a pocket.",
    after: "I understood why people travel for music: distance disappears when a favorite song begins.",
    tone: "blue",
  },
  {
    chapter: "01",
    year: "2023",
    date: "29 Jul",
    city: "Hanoi",
    title: "Where the Walk Began",
    subtitle: "The first chapter",
    note: "I came for the songs I already loved and left with a new ritual: remembering every detail.",
    favorite: "The opening VCR fading into the first live note—the exact moment the archive began.",
    before: "A printed ticket, a carefully planned outfit, and no idea how much this night would matter later.",
    after: "One sentence stayed with me on the way home: this deserves a place I can return to.",
    tone: "gold",
  },
];

const years = ["All", "2026", "2025", "2024", "2023"];

export default function Home() {
  const [activeYear, setActiveYear] = useState("All");

  const filteredMemories = useMemo(
    () =>
      activeYear === "All"
        ? memories
        : memories.filter((memory) => memory.year === activeYear),
    [activeYear],
  );

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to memories
      </a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Walking Through Memories home">
          <span className="wordmark-mark" aria-hidden="true">
            W
          </span>
          <span>
            Walking Through Memories
            <small>by Diem Vo</small>
          </span>
        </a>

        <nav aria-label="Primary navigation">
          <a href="#timeline">Timeline</a>
          <a href="#about">About</a>
        </nav>

        <span className="archive-range">Personal archive · 2023—Now</span>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">A personal concert archive</p>
            <h1 id="hero-title">
              Walking Through
              <em>Memories</em>
            </h1>
            <p className="hero-byline">by Diem Vo</p>
            <p className="hero-intro">
              Every concert is a chapter.
              <br />
              Every memory deserves a place.
            </p>
            <a className="walk-link" href="#timeline">
              <span>Begin the walk</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-art-frame">
              <span className="light-beam beam-one" />
              <span className="light-beam beam-two" />
              <span className="light-beam beam-three" />
              <span className="stage-haze" />
              <div className="stage-silhouette">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="hero-ticket">
                <span>ARCHIVE PASS</span>
                <strong>WTM / 001</strong>
                <small>Admit one memory</small>
              </div>
            </div>
            <p>
              <span>Latest memory</span>
              <strong>Chapter 04 · Neon Encore</strong>
            </p>
          </div>

          <p className="hero-index" aria-hidden="true">
            01 / 04
          </p>
        </section>

        <section className="timeline-section" id="timeline" aria-labelledby="timeline-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The afterglow timeline</p>
              <h2 id="timeline-title">Memory timeline</h2>
            </div>
            <p>
              Four demo chapters show how your concert stories will live here.
              Open a chapter to step inside the night.
            </p>
          </div>

          <div className="year-filter" aria-label="Filter memories by year">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                aria-pressed={activeYear === year}
                onClick={() => setActiveYear(year)}
              >
                {year}
              </button>
            ))}
          </div>

          {filteredMemories.length > 0 ? (
            <ol className="timeline-list">
              {filteredMemories.map((memory, index) => (
                <li
                  className={index % 2 === 0 ? "timeline-item align-right" : "timeline-item align-left"}
                  key={memory.chapter}
                >
                  <div className="timeline-marker" aria-hidden="true">
                    <span>{memory.year}</span>
                  </div>

                  <details className="memory-card">
                    <summary>
                      <div className={`memory-visual tone-${memory.tone}`} aria-hidden="true">
                        <span className="visual-beam beam-a" />
                        <span className="visual-beam beam-b" />
                        <span className="visual-orb" />
                        <span className="crowd-line" />
                        <span className="demo-badge">Demo chapter</span>
                        <span className="chapter-number">{memory.chapter}</span>
                      </div>
                      <div className="memory-summary">
                        <p className="memory-meta">
                          {memory.date} · {memory.city}
                        </p>
                        <h3>{memory.title}</h3>
                        <p className="memory-subtitle">{memory.subtitle}</p>
                        <span className="open-chapter">
                          <span>Open chapter</span>
                          <span aria-hidden="true">＋</span>
                        </span>
                      </div>
                    </summary>

                    <div className="chapter-body">
                      <blockquote>“{memory.note}”</blockquote>
                      <div className="chapter-grid">
                        <section>
                          <span>01</span>
                          <h4>Before the lights</h4>
                          <p>{memory.before}</p>
                        </section>
                        <section>
                          <span>02</span>
                          <h4>Favorite moment</h4>
                          <p>{memory.favorite}</p>
                        </section>
                        <section>
                          <span>03</span>
                          <h4>After the show</h4>
                          <p>{memory.after}</p>
                        </section>
                      </div>
                    </div>
                  </details>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-state" aria-live="polite">
              No memories found for this year.
            </p>
          )}
        </section>

        <section className="archive-stats" aria-label="Archive statistics">
          <div>
            <strong>04</strong>
            <span>Chapters</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Cities</span>
          </div>
          <div>
            <strong>04</strong>
            <span>Years walking</span>
          </div>
          <p>The numbers will grow. The feeling stays personal.</p>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-number" aria-hidden="true">
            DV
          </div>
          <div className="about-copy">
            <p className="eyebrow">About the archive</p>
            <h2 id="about-title">A place for the moments that outlast the music.</h2>
            <p>
              Walking Through Memories is Diem Vo&apos;s personal concert journal:
              a home for tickets, songs, lightsticks, favorite moments, and the
              stories that begin before the lights go down.
            </p>
            <p className="demo-note">
              This first edition uses curated demo chapters. Replace them with
              your own artists, photos, tickets, and stories when you are ready.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <p>Walking Through Memories</p>
        <blockquote>“The lights fade. The memory stays.”</blockquote>
        <p>Made with care by Diem Vo · 2026</p>
      </footer>
    </>
  );
}
