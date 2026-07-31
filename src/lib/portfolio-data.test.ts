import { describe, it, expect } from 'vitest';
import { profile, projects, experience, skills } from './portfolio-data';

describe('Portfolio data integrity', () => {
  describe('profile', () => {
    it('should have required profile fields', () => {
      expect(profile.name).toBeDefined();
      expect(profile.email).toBeDefined();
      expect(profile.github).toBeDefined();
      expect(profile.linkedin).toBeDefined();
    });

    it('should have valid email format', () => {
      expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should have valid URLs', () => {
      expect(profile.github).toMatch(/^https?:\/\//);
      expect(profile.linkedin).toMatch(/^https?:\/\//);
    });
  });

  describe('projects', () => {
    it('should have at least one project', () => {
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should have required fields for each project', () => {
      projects.forEach(project => {
        expect(project.id).toBeDefined();
        expect(project.title).toBeDefined();
        expect(project.oneLiner).toBeDefined();
        expect(project.tech).toBeInstanceOf(Array);
        expect(project.year).toBeTypeOf('number');
      });
    });

    it('should have valid project years', () => {
      projects.forEach(project => {
        expect(project.year).toBeGreaterThanOrEqual(2020);
        expect(project.year).toBeLessThanOrEqual(2030);
      });
    });

    it('should have unique project IDs', () => {
      const ids = projects.map(p => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('experience', () => {
    it('should have at least one experience entry', () => {
      expect(experience.length).toBeGreaterThan(0);
    });

    it('should have required fields for each experience', () => {
      experience.forEach(exp => {
        expect(exp.role).toBeDefined();
        expect(exp.org).toBeDefined();
        expect(exp.period).toBeDefined();
        expect(exp.points).toBeInstanceOf(Array);
      });
    });

    it('should have valid period format', () => {
      experience.forEach(exp => {
        // Accept both single month "Feb 2026" and range "May 2026 – Aug 2026" formats
        expect(exp.period).toMatch(/\w+ \d{4}( – \w+ \d{4})?/);
      });
    });
  });

  describe('skills', () => {
    it('should have skill categories', () => {
      expect(Object.keys(skills).length).toBeGreaterThan(0);
    });

    it('should have non-empty skill arrays', () => {
      Object.values(skills).forEach(skillArray => {
        expect(skillArray.length).toBeGreaterThan(0);
      });
    });

    it('should have valid skill entries', () => {
      Object.values(skills).forEach(skillArray => {
        skillArray.forEach(skill => {
          expect(typeof skill).toBe('string');
          expect(skill.length).toBeGreaterThan(0);
        });
      });
    });
  });
});