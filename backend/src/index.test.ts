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
    it('should analyze a txt file upload successfully', async () => {
      const content = 'This is a sample text file that contains enough characters to be analyzed properly. '.repeat(3);
      const form = new FormData();
      form.append('file', new File([content], 'sample.txt', { type: 'text/plain' }));

      const res = await app.request('/api/analyze/file', {
        method: 'POST',
        body: form,
      });

      expect(res.status).toBe(200);
      const json: any = await res.json();

      expect(json).toHaveProperty('classification');
      expect(json.metadata.submission_source).toBe('file');
      expect(json.metadata.file_metadata).toEqual(
        expect.objectContaining({
          name: 'sample.txt',
          type: 'txt',
        })
      );
    });

    it('should analyze a markdown file upload successfully', async () => {
      const content = `---\ntitle: Sample\n---\n\n# Heading\n\nThis markdown document has sufficient length for analysis.`.repeat(5);
      const form = new FormData();
      form.append('file', new File([content], 'notes.md', { type: 'text/markdown' }));

      const res = await app.request('/api/analyze/file', {
        method: 'POST',
        body: form,
      });

      expect(res.status).toBe(200);
      const json: any = await res.json();

      expect(json.metadata.file_metadata).toEqual(
        expect.objectContaining({
          name: 'notes.md',
          type: 'md',
        })
      );
    });

    it('should analyze an html file upload successfully', async () => {
      const content = `<html><head><title>Test</title><style>body{}</style></head><body><h1>Heading</h1><p>${'Paragraph content. '.repeat(15)}</p><script>const x = 1;</script></body></html>`;
      const form = new FormData();
      form.append('file', new File([content], 'page.html', { type: 'text/html' }));

      const res = await app.request('/api/analyze/file', {
        method: 'POST',
        body: form,
      });

      expect(res.status).toBe(200);
      const json: any = await res.json();

      expect(json.metadata.file_metadata).toEqual(
        expect.objectContaining({
          name: 'page.html',
          type: 'html',
        })
      );
    });

    it('should reject unsupported file types', async () => {
      const form = new FormData();
      form.append('file', new File(['Fake content'], 'sample.pdf', { type: 'application/pdf' }));

      const res = await app.request('/api/analyze/file', {
        method: 'POST',
        body: form,
      });

      expect(res.status).toBe(400);
      const json: any = await res.json();
      expect(json.error).toBe('File processing error');
    });

    it('should reject files that exceed processed character limits', async () => {
      const content = 'a'.repeat(21000);
      const form = new FormData();
      form.append('file', new File([content], 'large.txt', { type: 'text/plain' }));

      const res = await app.request('/api/analyze/file', {
        method: 'POST',
        body: form,
      });

      expect(res.status).toBe(400);
      const json: any = await res.json();
      expect(json.error).toBe('File processing error');
      expect(json.message).toContain('maximum length');
    });
  });
});
