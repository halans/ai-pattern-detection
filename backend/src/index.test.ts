import { describe, it, expect } from 'vitest';
import app from './index';

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return health check information', async () => {
      const res = await app.request('/');
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toHaveProperty('service');
      expect(json).toHaveProperty('version');
      expect(json).toHaveProperty('status');
      expect(json.status).toBe('operational');
    });
  });

  describe('POST /api/analyze', () => {
    it('should analyze AI-generated text successfully', async () => {
      // Simple short AI text that meets minimum length
      const text = 'As an AI model, I can help. '.repeat(10);

      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      expect(res.status).toBe(200);
      const json: any = await res.json();

      expect(json).toHaveProperty('classification');
      expect(json).toHaveProperty('confidence_score');
      expect(json).toHaveProperty('patterns_detected');
      expect(json).toHaveProperty('explanation');
      expect(json).toHaveProperty('metadata');
    });

    it('should return 400 for missing text field', async () => {
      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
      const json: any = await res.json();
      expect(json).toHaveProperty('error');
    });

    it('should return 400 for text too short', async () => {
      const text = 'Short.';

      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      expect(res.status).toBe(400);
      const json: any = await res.json();
      expect(json).toHaveProperty('error');
      expect(json.message).toContain('minimum');
    });

    it('should include metadata in response', async () => {
      const text = 'Test sentence. '.repeat(15);

      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      expect(res.status).toBe(200);
      const json: any = await res.json();

      expect(json.metadata).toHaveProperty('character_count');
      expect(json.metadata).toHaveProperty('word_count');
      expect(json.metadata).toHaveProperty('pattern_engine_version');
      expect(json.metadata).toHaveProperty('analysis_duration');
      expect(json.metadata).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/analyze/file', () => {
    it('should return 501 not implemented', async () => {
      const res = await app.request('/api/analyze/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(501);
      const json: any = await res.json();
      expect(json).toHaveProperty('error');
      expect(json.error).toBe('Not implemented');
    });
  });
});
