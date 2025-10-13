# 🧠 OpenSpec Change Proposal: AI Detection Tool

**Author:** Halans
**Date:** 2025-10-13  
**Status:** Draft  
**Change Type:** New Feature   
**Document Version:** v0.1  

---

## 1. Summary

This proposal introduces an **AI Detection Tool** that analyzes text or uploaded files to determine whether the content was written by an **AI** or a **human**. The tool leverages linguistic, statistical, and stylistic signals—aligned with established indicators of AI-generated text (see: [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing))—to generate a confidence score and detailed report.

---

## 2. Problem Statement

With the rise of generative AI systems, it has become increasingly difficult to distinguish between **human-written** and **AI-generated** text.  
Organizations, educators, and editors require tools that can **detect AI involvement** in written content to ensure authenticity, academic integrity, and compliance with content policies.

**Current challenges:**
- Lack of reliable detection across multiple formats (PDF, DOCX, TXT, HTML)
- Inconsistent performance across languages and writing domains
- Absence of a unified reporting and scoring standard

---

## 3. Goals and Non-Goals

### Goals
- Allow users to upload text or documents and detect AI authorship  
- Generate a clear, interpretable **confidence score** (0–100%) and classification (“AI-like,” “Human-like,” or “Mixed”)  
- Provide a breakdown of linguistic and stylistic indicators influencing the result  
- Support a variety of input formats and languages  

### Non-Goals
- The system will **not** identify which specific AI model generated the text  
- The system will **not** automatically enforce moderation or takedowns  
- The system is **not** a plagiarism detector (though future integration is possible)

---

## 4. User Stories

1. **As an educator**, I want to upload student essays and receive an AI detection report so I can assess authenticity.  
2. **As a journalist**, I want to analyze a press release for AI involvement before publication.  
3. **As an enterprise reviewer**, I want an API endpoint that automatically flags potentially synthetic writing.

---

## 5. Product Design

### 5.1 Input Handling

| Input Type | Description | Supported Formats |
|-------------|--------------|-------------------|
| Text input | User-pasted content (up to 20,000 characters) | Plain text |
| File upload | Uploaded file automatically parsed for text | `.txt`, `.docx`, `.pdf`, `.html`, `.md` |
| API input | JSON payload sent via API endpoint | UTF-8 text fields |

**Preprocessing Steps:**
- Normalize text (punctuation, Unicode, whitespace)
- Strip metadata and formatting (HTML tags, headers, footers)
- Tokenize using a transformer-compatible tokenizer

---

### 5.2 Detection Logic

The detection pipeline operates in **three layers**:

#### 1. Statistical Linguistic Features
- Perplexity and burstiness analysis  
- Sentence length uniformity  
- Repetition frequency and predictability metrics  

#### 2. Stylistic Features
- Overuse of filler transitions (“additionally,” “moreover,” etc.)  
- Semantic redundancy and verbosity  
- Consistent tone and lack of personal voice  

#### 3. Model-Based Classification
- Fine-tuned transformer model trained on:
  - **Human corpora:** Wikipedia, essays, discussion forums  
  - **AI corpora:** GPT, Claude, Gemini outputs  
- Binary classifier with calibrated output (Platt scaling)

---

### 5.3 Output Reporting

**Output Format:**
- **Classification:** “AI-written,” “Human-written,” or “Mixed”  
- **Confidence Score:** 0–100% probability  
- **Feature Breakdown:** Contribution of linguistic and stylistic signals  
- **Explainability Notes:** Plain-language rationale  
- **Downloadable Report:** JSON and PDF  

**Example Output (JSON):**
```json
{
  "classification": "AI-written",
  "confidence": 92.3,
  "signals": {
    "low_perplexity": 0.7,
    "uniform_sentence_length": 0.6,
    "semantic_redundancy": 0.4
  },
  "explanation": "The text shows unusually consistent structure and low linguistic variability typical of AI outputs."
}
```

---

## 6. Technical Architecture

### Components

1. **Frontend**
   - Text/file input UI  
   - Confidence visualization (bar graph, radar chart)  

2. **Backend API**
   - `/analyze`: accepts text or file uploads  
   - `/report`: returns structured report and metadata  

3. **ML Service**
   - Transformer-based classifier  
   - Deployed on GPU inference nodes with auto-scaling  

4. **Storage**
   - Temporary text cache (expires after 24 hours)  
   - Secure report storage for auditing  

**Infrastructure:**  
- Kubernetes deployment with autoscaling  
- Secure ingress via API Gateway  
- Model monitoring and retraining via MLOps pipeline  

---

## 7. Security and Privacy

- No long-term text storage without user consent  
- All processing occurs in volatile memory; text deleted post-analysis  
- TLS 1.3 encryption in transit, AES-256 at rest  
- GDPR and CCPA compliant data handling  

---

## 8. Metrics and KPIs

| Metric | Target |
|--------|---------|
| Detection Accuracy (AUC) | ≥ 0.90 |
| False Positive Rate | ≤ 10% |
| Average Response Time | ≤ 3 seconds / 1,000 words |
| User Satisfaction (survey) | ≥ 85% positive |

---

## 9. Future Considerations

- Multi-language support (FR, ES, ZH)  
- Integration with plagiarism detection tools  
- Browser extension or CMS plugin for inline detection  
- Continuous retraining as AI writing evolves  

---

## 10. Appendix

- **Reference:** [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)  
- **Example Datasets:**
  - Human: Wikipedia, Common Crawl, Reddit corpus  
  - AI: OpenAI GPT outputs, Anthropic Claude samples  
- **Benchmark Comparators:** GPTZero, TurnItIn AI Detector, OpenAI Text Classifier  



## 11. Tech Stack

### Frontend
- React with TypeScript
- Vite (build tool)
- TailwindCSS (styling)

### Backend
- Cloudflare Workers (TypeScript)
- Hono or similar lightweight framework

### ML Service
- Python with FastAPI
- HuggingFace Transformers
- PyTorch/TensorFlow

### File Processing
- pdf-parse (PDF extraction)
- mammoth (DOCX parsing)
- markdown-it (Markdown processing)

### Infrastructure
- Cloudflare Workers (API layer)
- Kubernetes (ML service)
- Object storage (temporary file cache)


## 12. Project Conventions

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- 2-space indentation
- Functional components and hooks for React
- Named exports preferred over default exports

### Architecture Patterns
- Clean separation: Frontend → API Gateway → ML Service
- RESTful API design
- Stateless workers for horizontal scaling
- Event-driven model updates via MLOps pipeline

### Testing Strategy
- Unit tests: Jest/Vitest (≥80% coverage target)
- Integration tests: API endpoint validation
- E2E tests: Playwright for critical user flows
- ML model: Separate validation set, continuous monitoring

### Git Workflow
- Main branch: production-ready code
- Feature branches: `feature/description`
- Conventional Commits (feat, fix, docs, refactor, test)
- PR required for main branch merges

## 13. Domain Context

### AI Detection Principles
- Detection based on linguistic patterns, not watermarking
- Perplexity: measure of text predictability (lower = more AI-like)
- Burstiness: variation in sentence structure (lower = more uniform/AI-like)
- Common AI signals: overuse of transitions, semantic redundancy, consistent tone

### Model Training Context
- Human corpus: Wikipedia, essays, forums, published articles
- AI corpus: outputs from GPT-3.5+, Claude, Gemini, other LLMs
- Continuous retraining needed as AI writing evolves
- Platt scaling for probability calibration

### Limitations
- Detection accuracy degrades with heavy human editing of AI text
- Short texts (<100 words) have lower reliability
- Domain-specific technical writing may trigger false positives

## 14. Important Constraints

### Technical Constraints
- Cloudflare Workers: 10MB request limit, 50ms CPU time limit
- File uploads: Max 10MB per file
- Text processing: Max 20,000 characters per analysis
- API rate limiting: TBD based on infrastructure capacity

### Privacy & Compliance
- GDPR compliance: no long-term storage without consent
- CCPA compliance: data deletion requests honored
- No retention of analyzed text beyond 24 hours (cache only)
- TLS 1.3 in transit, AES-256 at rest

### Business Constraints
- Cannot guarantee 100% accuracy (inherent limitation of detection)
- No identification of specific AI models
- No automated enforcement actions (advisory tool only)

## 15. External Dependencies

### Core Services
- HuggingFace Model Hub (pre-trained transformers)
- Cloudflare Workers/CDN (hosting and edge compute)
- Kubernetes cluster (ML inference service)

### File Processing Libraries
- pdf-parse, mammoth, markdown-it (format conversion)
- Tokenizer from HuggingFace (text preprocessing)

### Monitoring & Observability
- Sentry or similar (error tracking)
- Cloudflare Analytics (usage metrics)
- MLOps platform (model performance monitoring)

### Optional/Future
- Plagiarism detection APIs (integration possibility)
- Translation services (multi-language support)
- Browser extension APIs (inline detection)


