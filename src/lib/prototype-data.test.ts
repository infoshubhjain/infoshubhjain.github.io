import { describe, it, expect } from 'vitest';
import { SECTIONS, driver, wins, directives, standings, trophies } from './prototype-data';

describe('Live site data integrity', () => {
  describe('driver', () => {
    it('should have required profile fields', () => {
      expect(driver.name).toBeDefined();
      expect(driver.email).toBeDefined();
      expect(driver.github).toBeDefined();
      expect(driver.linkedin).toBeDefined();
    });

    it('should have valid email format', () => {
      expect(driver.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should have valid URLs', () => {
      expect(driver.github).toMatch(/^https?:\/\//);
      expect(driver.linkedin).toMatch(/^https?:\/\//);
    });

    // The résumé buttons are the primary recruiter CTA. A relative path here
    // means a 404 — /resume.pdf has never existed in public/.
    it('should point the resume at a reachable absolute URL', () => {
      expect(driver.resumeUrl).toMatch(/^https?:\/\//);
    });
  });

  describe('SECTIONS', () => {
    it('should have unique section ids', () => {
      const ids = SECTIONS.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    // The sitemap emits /#<id> for each of these, so a typo publishes a dead anchor.
    it('should have a plain-language label for every section', () => {
      SECTIONS.forEach((s) => {
        expect(s.id).toMatch(/^[a-z-]+$/);
        expect(s.plain.length).toBeGreaterThan(0);
      });
    });
  });

  describe('wins', () => {
    it('should have at least one win', () => {
      expect(wins.length).toBeGreaterThan(0);
    });

    it('should have unique win ids', () => {
      const ids = wins.map((w) => w.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have required fields for each win', () => {
      wins.forEach((w) => {
        expect(w.id).toBeDefined();
        expect(w.name).toBeDefined();
        expect(w.circuit).toBeDefined();
        expect(w.tech).toBeInstanceOf(Array);
        expect(w.impact).toBeInstanceOf(Array);
        expect(w.year).toMatch(/^\d{4}$/);
      });
    });

    it('should have absolute hrefs on every link', () => {
      wins.forEach((w) => {
        w.links.forEach((l) => {
          expect(l.href, `${w.id} → ${l.label}`).toMatch(/^https?:\/\//);
        });
      });
    });

    // The 7 screenshots in public/projects were AI stock art unrelated to the
    // work and were deleted. Nothing should reference that directory again
    // without the file actually being committed.
    it('should not reference removed project screenshots', () => {
      wins.forEach((w) => {
        expect(w.image, `${w.id} still points at a deleted screenshot`).toBeUndefined();
      });
    });
  });

  describe('directives', () => {
    it('should have a recognised kind', () => {
      directives.forEach((d) => {
        expect(['Paper', 'Book', 'Patent', 'Training']).toContain(d.kind);
      });
    });

    // layout.tsx derives the JSON-LD `isbn` via venue.replace("ISBN ", ""),
    // so a book whose venue drops the prefix silently publishes a junk ISBN.
    it('should carry an ISBN in the venue of every book', () => {
      directives
        .filter((d) => d.kind === 'Book')
        .forEach((d) => {
          expect(d.venue, d.title).toMatch(/^ISBN /);
        });
    });
  });

  describe('standings', () => {
    it('should have required fields and a parseable period', () => {
      expect(standings.length).toBeGreaterThan(0);
      standings.forEach((s) => {
        expect(s.team).toBeDefined();
        expect(s.role).toBeDefined();
        expect(s.points).toBeInstanceOf(Array);
        // "May 2026 – Aug 2026", "Aug 2025 – Present", "Oct 2025", and
        // year-only forms such as "2023" / "2022 – 2023" for the two CV
        // entries that give a season rather than a month.
        expect(s.period, s.team).toMatch(
          /^(\w+ )?\d{4}( – ((\w+ )?\d{4}|Present))?$/,
        );
      });
    });
  });

  describe('trophies', () => {
    it('should sit in tier 1 or 2', () => {
      expect(trophies.length).toBeGreaterThan(0);
      trophies.forEach((t) => {
        expect([1, 2]).toContain(t.tier);
        expect(t.title).toBeDefined();
        expect(t.issuer).toBeDefined();
      });
    });
  });
});
