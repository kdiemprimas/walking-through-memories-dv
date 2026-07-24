"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

type MediaItem = {
  label: string;
  title: string;
  embedUrl: string;
};

type Memory = {
  chapter: string;
  year: string;
  date: string;
  dateTime: string;
  city: string;
  venue: string;
  title: string;
  subtitle: string;
  note: string;
  favorite: string;
  before: string;
  after: string;
  tone: "blush" | "rose" | "blue" | "gold";
  gallery: GalleryItem[];
  media: MediaItem[];
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicAsset = (path: string) => `${basePath}${path}`;

const memories: Memory[] = [
  {
    chapter: "01",
    year: "2025",
    date: "04 Oct",
    dateTime: "2025-10-04",
    city: "Hanoi",
    venue: "My Dinh Indoor Athletics Arena",
    title: "BAEKHYUN WORLD TOUR <Reverie> IN HANOI",
    subtitle:
      "Reverie was never just a dream—it was the precious moment of being there with Baekhyunee, sharing the same music, emotions, and glowing lights.",
    note:
      "In Hanoi, Reverie became more than the name of a concert—it became a memory filled with Baekhyunee’s voice, laughter, and warmth.",
    before:
      "Every song made the distance between the stage and the crowd disappear, turning the night into something deeply personal.",
    favorite:
      "I arrived carrying years of admiration and left with a beautiful moment that will stay with me long after the final lights faded.",
    after:
      "The night may have ended, but Reverie will always live on in my heart—a beautiful reminder that, for one unforgettable moment, I was there with Baekhyunee. Until we meet again, I’ll keep walking through this memory.",
    tone: "blush",
    gallery: [
      {
        src: publicAsset("/memories/baekhyun-reverie/eri-bong.webp"),
        alt: "EXO lightsticks glowing in the audience at Baekhyun Reverie in Hanoi",
        caption: "Eri-bong",
        width: 1500,
        height: 2000,
      },
      {
        src: publicAsset("/memories/baekhyun-reverie/diem-vo.webp"),
        alt: "Diem Vo wearing a soft pink concert outfit at Reverie in Hanoi",
        caption: "DiemVo here!",
        width: 1500,
        height: 2000,
      },
      {
        src: publicAsset("/memories/baekhyun-reverie/baekhyunee.webp"),
        alt: "Black-and-white portrait of Baekhyun for Harper's Bazaar",
        caption: "Baekhyunee",
        width: 1000,
        height: 1400,
      },
    ],
    media: [
      {
        label: "Concert film",
        title: "Reverie in Hanoi concert memory",
        embedUrl: "https://www.youtube-nocookie.com/embed/6k_HJdxqVT4",
      },
      {
        label: "Memory soundtrack",
        title: "Reverie memory soundtrack",
        embedUrl: "https://www.youtube-nocookie.com/embed/ufX7VluncTY",
      },
    ],
  },
];

const years = ["All", ...new Set(memories.map((memory) => memory.year))];

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

        <span className="archive-range">Personal archive · 2025—Now</span>
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

          <div className="hero-art">
            <div className="hero-art-frame">
              <Image
                className="hero-cover"
                src={memories[0].gallery[2].src}
                alt=""
                width={memories[0].gallery[2].width}
                height={memories[0].gallery[2].height}
                priority
                unoptimized
                sizes="(max-width: 960px) 88vw, 36vw"
              />
              <span className="stage-haze" aria-hidden="true" />
              <div className="hero-ticket" aria-hidden="true">
                <span>MEMORY PASS</span>
                <strong>WTM / 001</strong>
                <small>Hanoi · 04.10.2025</small>
              </div>
            </div>
            <p>
              <span>Latest memory</span>
              <strong>Chapter 01 · Reverie in Hanoi</strong>
            </p>
          </div>

          <p className="hero-index" aria-hidden="true">
            01 / 01
          </p>
        </section>

        <section className="timeline-section" id="timeline" aria-labelledby="timeline-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The afterglow timeline</p>
              <h2 id="timeline-title">Memory timeline</h2>
            </div>
            <p>
              The archive begins in Hanoi with a night of music, rose light,
              and a memory that still feels close.
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
                  key={`${memory.year}-${memory.chapter}`}
                >
                  <div className="timeline-marker" aria-hidden="true">
                    <span>{memory.year}</span>
                  </div>

                  <details className="memory-card" open>
                    <summary>
                      <div className={`memory-visual tone-${memory.tone}`}>
                        <Image
                          className="memory-cover"
                          src={memory.gallery[0].src}
                          alt=""
                          width={memory.gallery[0].width}
                          height={memory.gallery[0].height}
                          unoptimized
                          sizes="(max-width: 960px) 82vw, 38vw"
                        />
                        <span className="memory-cover-shade" aria-hidden="true" />
                        <span className="chapter-badge">First memory</span>
                        <span className="chapter-number" aria-hidden="true">
                          {memory.chapter}
                        </span>
                      </div>
                      <div className="memory-summary">
                        <p className="memory-meta">
                          <time dateTime={memory.dateTime}>{memory.date}</time> · {memory.city}
                        </p>
                        <h3>{memory.title}</h3>
                        <p className="memory-subtitle">{memory.subtitle}</p>
                        <p className="memory-venue">{memory.venue}</p>
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

                      <section className="memory-gallery" aria-labelledby={`gallery-${memory.chapter}`}>
                        <div className="chapter-section-heading">
                          <div>
                            <span>04</span>
                            <h4 id={`gallery-${memory.chapter}`}>From my camera roll</h4>
                          </div>
                          <p>Three fragments from a night I want to keep close.</p>
                        </div>
                        <div className="gallery-grid">
                          {memory.gallery.map((image) => (
                            <figure key={image.src}>
                              <Image
                                src={image.src}
                                alt={image.alt}
                                width={image.width}
                                height={image.height}
                                loading="lazy"
                                unoptimized
                                sizes="(max-width: 620px) 88vw, (max-width: 960px) 42vw, 26vw"
                              />
                              <figcaption>{image.caption}</figcaption>
                            </figure>
                          ))}
                        </div>
                      </section>

                      <section className="memory-media" aria-labelledby={`media-${memory.chapter}`}>
                        <div className="chapter-section-heading">
                          <div>
                            <span>05</span>
                            <h4 id={`media-${memory.chapter}`}>Press play, return to the night</h4>
                          </div>
                          <p>Concert moments and the soundtrack that carries them.</p>
                        </div>
                        <div className="media-grid">
                          {memory.media.map((item) => (
                            <article key={item.embedUrl}>
                              <p>{item.label}</p>
                              <div className="video-frame">
                                <iframe
                                  src={item.embedUrl}
                                  title={item.title}
                                  loading="lazy"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  allowFullScreen
                                />
                              </div>
                            </article>
                          ))}
                        </div>
                      </section>
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
            <strong>01</strong>
            <span>Chapter</span>
          </div>
          <div>
            <strong>01</strong>
            <span>City</span>
          </div>
          <div>
            <strong>01</strong>
            <span>Year walking</span>
          </div>
          <p>The archive starts with Reverie. The feeling keeps growing.</p>
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
            <p className="archive-note">
              Chapter 01 begins with Baekhyun&apos;s Reverie in Hanoi—one night,
              three photographs, and a feeling worth returning to.
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
