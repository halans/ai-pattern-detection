# Design Document: Slop Detection Tool (Pattern-Based)

## Context

The Slop Detection Tool provides a simple, pattern-based system for analyzing text and documents to detect AI-generated content. Unlike complex ML-based solutions, this approach uses regex patterns to identify linguistic signals characteristic of AI writing, making it fast, transparent, and easy to maintain.

**Key Stakeholders:**
- Educators (detecting AI in student submissions)
- Journalists and editors (verifying press releases and articles)
- Content moderators (flagging synthetic content)
- Privacy-conscious users (zero data retention)

**Constraints:**
- Cloudflare Workers: 10MB request limit, 50ms CPU time limit
- Zero data retention (GDPR/CCPA compliance)
- No external ML services or GPU infrastructure
- Pattern detection must complete in <500ms per 1,000 words

---

## Goals / Non-Goals

### Goals
- Build a simple, fast AI detection system using pattern matching
- Support multiple input formats (text, PDF, DOCX, HTML, MD)
- Provide transparent, explainable results showing detected patterns
- Ensure complete privacy with zero data retention
- Maintain updateable pattern registry as AI writing evolves

### Non-Goals
- ML-based classification (explicitly avoided for simplicity)
- OCR support for scanned documents
- Multi-language support beyond English in v1
- Identification of specific AI models (GPT-3 vs. Claude, etc.)
- Real-time streaming analysis
- Persistent storage or user accounts

---

## Decisions

### 1. Architecture Pattern: Two-Tier Serverless

**Decision:** Implement Frontend (React on Cloudflare Pages) → Backend (Cloudflare Workers with TypeScript).

**Rationale:**
- Cloudflare Workers provide edge computing with zero cold start
- No database or persistent storage needed
- Horizontal scaling handled automatically by Cloudflare
- All processing happens in-memory (ephemeral, privacy-first)
- Simple deployment and maintenance

**Alternatives Considered:**
- Three-tier with ML service: Rejected for unnecessary complexity
- Traditional server with database: Rejected due to privacy concerns and infrastructure overhead
- Client-side processing: Rejected due to security concerns with file parsing

---

### 2. Detection Method: Regex-Based Pattern Matching

**Decision:** Use pre-compiled regex patterns to detect AI writing signals, scored by severity weights.

**Rationale:**
- Fast: O(n) complexity, completes in <50ms for typical texts
- Transparent: Users see exactly which patterns were detected
- Updateable: Pattern registry can evolve without retraining
- No infrastructure: No GPUs, Kubernetes, or ML dependencies
- Interpretable: Each pattern has clear meaning and examples

**Patterns include:**
- Significance statements ("stands as", "serves as")
- Cultural clichés ("rich tapestry", "profound legacy")
- Editorializing ("it's important to note")
- AI meta-text ("as an AI", "as of my last update")
- Collaborative phrases ("let me know if", "I hope this helps")
- Formatting patterns (emoji headings, em-dash spam)

**Alternatives Considered:**
- ML transformer models: Rejected for complexity, infrastructure requirements
- Statistical NLP (perplexity, burstiness): Rejected for computational cost
- Manual review: Rejected for lack of scalability
- Third-party AI detection APIs: Rejected for privacy and cost concerns

---

### 3. Scoring Algorithm: Weighted Pattern Frequency

**Decision:** Calculate score based on pattern matches weighted by severity (CRITICAL: 20, HIGH: 10, MEDIUM: 5, LOW: 2).

**Rationale:**
- Simple to understand and audit
- Allows tuning weights based on real-world testing
- Different pattern types have different reliability
- Thresholds (0-30: Human, 31-69: Mixed, 70-100: AI) are interpretable

**Score Calculation:**
```
score = sum(pattern_count × severity_weight)
normalized_score = min(100, score)
```

**Alternatives Considered:**
- Binary classification: Rejected for lack of nuance
- Complex weighting functions: Rejected for opacity
- ML-based scoring: Rejected for consistency with pattern-based approach

---

### 4. File Processing: Ephemeral Server-Side Parsing

**Decision:** Process all files server-side in memory, with no persistent storage or disk writes.

**Rationale:**
- Security: File validation in controlled environment
- Privacy: No retention of uploaded files
- Consistency: Same parsing logic for all users
- Simplicity: No storage infrastructure required

**Implementation:**
- Files processed entirely in Cloudflare Workers memory
- Text extracted using libraries (pdf-parse, mammoth, etc.)
- Immediate cleanup after analysis completes
- No caching, no logs of file content

**Alternatives Considered:**
- Client-side parsing: Rejected due to security vulnerabilities
- Temporary storage (R2/S3): Rejected as unnecessary complexity
- Streaming processing: Rejected for implementation complexity

---

### 5. Data Retention: Absolute Zero Retention

**Decision:** No storage of analyzed text, file content, or reports. All processing is ephemeral.

**Rationale:**
- Maximum privacy guarantee
- GDPR/CCPA compliance without consent flows
- Reduces liability and attack surface
- Aligns with user expectations for privacy-focused tool
- Simplifies infrastructure (no database needed)

**Implications:**
- Users must save reports themselves
- No report retrieval by ID
- No analysis history or usage tracking
- Cannot reproduce past analyses

**Alternatives Considered:**
- 24-hour cache: Rejected as unnecessary for simple reports
- Optional storage with consent: Rejected for UX complexity
- Anonymized analytics: Rejected to maintain strongest privacy guarantee

---

### 6. API Design: Simple Synchronous REST

**Decision:** Implement REST API with synchronous POST endpoints only.

**Rationale:**
- Pattern matching is fast enough (<500ms) for sync responses
- No need for async processing or polling
- Simple to document and use
- Works with standard HTTP clients

**Endpoints:**
- `POST /api/analyze` - Analyze text input
- `POST /api/analyze/file` - Analyze uploaded file

**Alternatives Considered:**
- Async with polling: Rejected as unnecessary for fast processing
- WebSockets: Rejected for added complexity
- GraphQL: Rejected as overkill for simple API

---

## Risks / Trade-offs

### Risk: Pattern Evasion as AI Writing Improves
**Impact:** AI models learn to avoid detected patterns, reducing effectiveness.
**Mitigation:** Maintain updateable pattern registry. Monitor false negatives. Community contributions for new patterns. Regular updates to pattern database.

### Risk: False Positives on Technical/Formal Writing
**Impact:** Users lose trust if technical documentation is incorrectly flagged.
**Mitigation:** Weight patterns by reliability. Provide clear breakdown of detected patterns. Set thresholds conservatively. Document limitations clearly.

### Risk: Regex Performance with Many Patterns
**Impact:** Processing slows down with 20+ patterns on large texts.
**Mitigation:** Pre-compile all patterns on worker initialization. Use efficient regex engines. Stream processing for very large texts. Benchmark and optimize patterns.

### Trade-off: Accuracy vs. Simplicity
**Decision:** Prioritize simplicity, transparency, and privacy over maximum accuracy.
**Rationale:**
- Pattern-based detection is "good enough" for many use cases
- Users value transparency over opaque ML predictions
- Zero infrastructure complexity enables faster iteration
- Privacy guarantee is unique differentiator

**Expected Accuracy:** 70-85% (lower than ML-based, but acceptable with clear limitations disclosure)

---

## Migration Plan

### Phase 1: Core Pattern Engine (Weeks 1-2)
- Implement pattern registry with 20+ patterns
- Build text analyzer with pre-compilation
- Create scoring algorithm
- Unit tests for pattern detection

### Phase 2: Backend API (Weeks 3-4)
- Set up Cloudflare Workers project
- Implement text preprocessing
- Create `/analyze` endpoint
- Add error handling and validation

### Phase 3: File Processing (Weeks 5-6)
- Integrate file parsing libraries
- Implement format-specific extractors
- Add file validation
- Test all supported formats

### Phase 4: Frontend (Weeks 7-9)
- Build React UI with TailwindCSS
- Implement text/file input components
- Create results visualization
- Add export functionality (JSON/PDF)

### Phase 5: Deployment & Testing (Weeks 10-11)
- Deploy to Cloudflare Workers/Pages
- Load testing and performance validation
- Security audit
- Pattern weight tuning with real data

### Phase 6: Documentation & Launch (Week 12)
- Write user guide and API docs
- Create pattern documentation
- Privacy policy and terms
- Launch announcement

### Rollback Strategy
- Cloudflare Workers support instant rollback to previous version
- No database means no migration rollback needed
- Frontend can be rolled back independently
- Pattern registry updates are non-breaking (additive)

---

## Open Questions

### Q1: Should pattern weights be user-configurable?
**Options:**
- Fixed weights (simpler)
- API parameter to adjust sensitivity
- UI slider for threshold adjustment
**Decision needed by:** Week 3
**Impact:** API design, UX complexity

### Q2: Should we support batch analysis via API?
**Context:** Users may want to analyze multiple texts at once.
**Options:**
- Single-text only (simpler)
- Batch endpoint with array input
**Decision needed by:** Week 4
**Impact:** API design, response format

### Q3: How should we handle pattern contributions?
**Options:**
- Internal updates only
- GitHub issues for suggestions
- Public pattern registry with community PRs
**Decision needed by:** Week 6
**Impact:** Maintenance overhead, community engagement

### Q4: Should we provide a pattern testing/debugging mode?
**Context:** Users may want to test specific patterns or understand false positives.
**Options:**
- No debug mode (simpler)
- Admin-only debug endpoint
- Public pattern tester UI
**Decision needed by:** Week 8
**Impact:** Development time, UX features

---

## Monitoring and Observability

### Key Metrics
- **Processing Time:** P95 latency for analysis (target <500ms)
- **Pattern Hit Rate:** Frequency of each pattern (detect unused patterns)
- **Score Distribution:** Histogram of scores (validate thresholds)
- **Error Rate:** Failed analyses (target <1%)
- **Availability:** API uptime (target 99.9%)

### Monitoring Stack
- Cloudflare Analytics: Request metrics, latency, errors
- Sentry (optional): Error tracking
- Custom metrics: Pattern frequency, score distribution

### Alerting
- P95 latency exceeds 1 second
- Error rate exceeds 2%
- Worker CPU time approaches 50ms limit

---

## Security Considerations

### Input Validation
- File size limits (10MB max)
- File format validation (MIME type + magic bytes)
- Text sanitization to prevent XSS
- Character encoding validation (UTF-8 only)

### Data Protection
- TLS 1.3 for all API traffic
- No logging of analyzed text content
- No persistent storage of any kind
- Immediate memory cleanup after processing

### Infrastructure Security
- Cloudflare WAF for DDoS protection
- Rate limiting per IP (if needed)
- CORS configuration with whitelist
- Regular dependency updates

### Compliance
- GDPR: No personal data processing
- CCPA: No data sale (no data collected)
- Privacy policy: Document zero-retention guarantee
- Terms of service: Clarify limitations and intended use

---

## Pattern Registry Management

### Pattern Structure
```typescript
interface Pattern {
  id: string;
  name: string;
  description: string;
  regex: RegExp;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  weight: number;
  examples: string[];
  falsePositiveRisk: 'low' | 'medium' | 'high';
}
```

### Update Process
1. Identify new AI writing pattern
2. Create regex and test against samples
3. Assess false positive risk
4. Assign severity and weight
5. Add to pattern registry
6. Deploy update (zero downtime)
7. Monitor impact on score distribution

### Versioning
- Pattern engine version included in report metadata
- Breaking changes require new major version
- Additive pattern updates are minor versions
