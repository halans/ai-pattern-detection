const LAST_UPDATED = 'October 19, 2025';

export default function TermsAndConditions() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-8" aria-labelledby="terms-conditions-heading">
      <section className="glass-panel liquid-glow p-6 space-y-4">
        <h1 id="terms-conditions-heading" className="text-3xl font-extrabold font-sora">
          Terms and Conditions
        </h1>
        <p className="text-sm text-text-muted dark:text-text-dark-muted">
          <strong>Last Updated:</strong> {LAST_UPDATED}
        </p>
        <p>
          These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Slop Detector web
          application, APIs, and related services (collectively, the &ldquo;Service&rdquo;). By using the Service, you
          agree to be bound by these Terms. If you do not agree, do not access or use the Service.
        </p>
      </section>

      <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="terms-description">
        <h2 id="terms-description" className="text-2xl font-bold">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using Slop Detector, you acknowledge that you have read, understood, and agree to comply with
          these Terms. If you are using the Service on behalf of an organization, you represent that you have authority
          to bind that organization to these Terms.
        </p>
      </section>

      <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="terms-service">
        <h2 id="terms-service" className="text-2xl font-bold">
          2. Description of Service
        </h2>
        <p>
          Slop Detector provides pattern-based analysis to help identify characteristics of AI-generated content. The
          Service processes submitted text, runs deterministic pattern detection, and surfaces results such as
          classifications, confidence scores, and supporting pattern matches. Access is offered without registration and
          may include web, API, or extension interfaces.
        </p>
      </section>

      <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="terms-acceptable-use">
        <h2 id="terms-acceptable-use" className="text-2xl font-bold">
          3. Acceptable Use Policy
        </h2>
        <p>You agree to use the Service responsibly and only for lawful purposes. You must not:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Automate high-volume requests, scraping, or other abusive traffic.</li>
          <li>Interfere with or attempt to reverse engineer the detection logic or infrastructure.</li>
          <li>Use the Service to harass, discriminate, or violate the rights of others.</li>
          <li>Submit content that contains malicious code or attempts to exploit security vulnerabilities.</li>
          <li>Misrepresent analysis results as definitive proof without independent verification.</li>
        </ul>
      </section>

      <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="terms-accuracy">
        <h2 id="terms-accuracy" className="text-2xl font-bold">
          4. Accuracy and Limitations Disclaimer
        </h2>
        <p>
          Analysis results are probabilistic indicators, not determinations of authorship. False positives and false
          negatives can occur, especially in academic, technical, or stylized writing. You agree not to rely solely on
          the Service for consequential decisions and to pair results with human review when accuracy is critical. We do
          not warrant that any output is accurate, complete, or free from error.
        </p>
      </section>

      <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="terms-ip">
        <h2 id="terms-ip" className="text-2xl font-bold">
          5. Intellectual Property
        </h2>
        <p>
          Slop Detector, including its pattern libraries, algorithms, and user interface, is owned by the project
          maintainers and protected by applicable intellectual property laws. All open-source components remain subject
          to their respective licenses. You retain ownership of any text you submit, and results generated from your
          submissions belong to you.
        </p>
      </section>

      <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="terms-privacy">
        <h2 id="terms-privacy" className="text-2xl font-bold">
          6. Privacy and Data Handling
        </h2>
        <p>
          We process submitted content in real time and do not store or retain the text you provide. Additional details
          about data handling, third-party services, and security practices are available in our{' '}
          <a className="underline hover:no-underline" href="/privacy">
            Privacy Policy
          </a>
          . By using the Service, you acknowledge that you have reviewed and accept the Privacy Policy.
        </p>
      </section>

      <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="terms-liability">
        <h2 id="terms-liability" className="text-2xl font-bold">
          7. Limitation of Liability
        </h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; without warranties of any kind, whether express or implied,
          including implied warranties of merchantability, fitness for a particular purpose, or non-infringement. To the
          fullest extent permitted by law, Slop Detector is not liable for any damages arising from or related to your
          use of the Service, including direct, indirect, incidental, consequential, or punitive damages.
        </p>
      </section>

      <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="terms-modifications">
        <h2 id="terms-modifications" className="text-2xl font-bold">
          8. Service Modifications
        </h2>
        <p>
          We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.
          Updates to the detection patterns or infrastructure may change analysis results. We are not liable for any
          impact resulting from Service changes, downtime, or feature removals.
        </p>
      </section>

      <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="terms-changes">
        <h2 id="terms-changes" className="text-2xl font-bold">
          9. Changes to Terms
        </h2>
        <p>
          We may update these Terms periodically. When changes are made, the &ldquo;Last Updated&rdquo; date will be
          revised. Continued use of the Service after changes become effective constitutes acceptance of the revised
          Terms. If you do not agree to the updated Terms, you must stop using the Service.
        </p>
      </section>

      <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="terms-contact">
        <h2 id="terms-contact" className="text-2xl font-bold">
          10. Contact Information
        </h2>
        <p>
          Questions or concerns about these Terms may be directed to the maintainers via{' '}
          <a
            className="underline hover:no-underline"
            href="https://github.com/halans/ai-pattern-detection"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub issues
          </a>{''}.
        </p>
      </section>
    </main>
  );
}
