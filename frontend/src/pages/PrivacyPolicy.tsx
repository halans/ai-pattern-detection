export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-8" aria-labelledby="privacy-policy-heading">
    
        <section className="glass-panel liquid-glow p-6">
        <h1 id="privacy-policy-heading" className="text-3xl font-extrabold font-sora">
          Privacy Policy
        </h1>

          <p className="pt-4 text-sm text-text-muted dark:text-text-dark-muted"><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

          <p className="mt-4">
            Slop Detector (“we,” “our,” or “us”) is committed to protecting your privacy. 
            This Privacy Policy explains how our <strong>web application</strong>, <strong>backend API</strong>, 
            and <strong>Chrome extension</strong> handle your information. 
            We believe in full transparency: we do <strong>not collect, log, or retain</strong> any of the text or data 
            you analyze through our services.
          </p>
        </section>
        <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="privacy-web-app">
          <h2 id="privacy-web-app" className="text-2xl font-bold">1. Web Application</h2>
          <p>When you use the Slop Detector web app, any text you paste or upload is processed in real time and never stored.</p>
          <ul>
            <li><strong>No storage:</strong> Your text is processed in memory and discarded immediately after analysis.</li>
            <li><strong>No cookies or tracking:</strong> We do not use cookies, session identifiers, analytics scripts, or any other tracking technologies.</li>
            <li><strong>Client-side rendering:</strong> All reports and results are rendered directly in your browser. Nothing is saved on our servers after processing is complete.</li>
            <li><strong>Temporary data:</strong> If a file is uploaded, it is analyzed transiently and erased immediately after the result is generated.</li>
          </ul>

          </section>
        <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="privacy-web-app">
          <h2 id="privacy-web-app" className="text-2xl font-bold">2. Backend API</h2>
          <p>Our API is designed with privacy by default.</p>
          <ul>
            <li><strong>Volatile processing:</strong> All text submitted to the API is received via secure HTTPS, processed entirely in memory, and discarded instantly after analysis.</li>
            <li><strong>No logging:</strong> We do not record, log, or retain the text you submit, your IP address, or any associated metadata.</li>
            <li><strong>No profiling:</strong> The API does not use artificial intelligence, machine learning, or user behavior profiling. It relies solely on deterministic pattern matching.</li>
            <li><strong>No analytics:</strong> We do not use third-party analytics or telemetry services.</li>
          </ul>

          </section>
        <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="privacy-web-app">
          <h2 id="privacy-web-app" className="text-2xl font-bold">3. Chrome Extension</h2>
          <p>The Slop Detector Chrome Extension allows users to analyze content directly from their browser with the same privacy guarantees.</p>
          <ul>
            <li><strong>Minimal permissions:</strong> The extension requests only the permissions required to capture visible text and display analysis results.</li>
            <li><strong>No storage:</strong> Captured text is not stored in local storage, synced storage, or any external server.</li>
            <li><strong>Direct connection:</strong> The extension transmits text directly to our API using HTTPS, where it is analyzed and discarded immediately.</li>
            <li><strong>No tracking or identifiers:</strong> The extension does not assign or store any persistent identifiers.</li>
          </ul>

          </section>
        <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="privacy-web-app">
          <h2 id="privacy-web-app" className="text-2xl font-bold">4. Data Security</h2>
          <p>We take strong security measures to protect all data in transit and ensure compliance with privacy best practices.</p>
          <ul>
            <li><strong>Encryption:</strong> All network communication between the web app, API, and extension is encrypted using HTTPS/TLS.</li>
            <li><strong>No accounts or authentication:</strong> Slop Detector does not require user accounts, login credentials, or personal identifiers.</li>
            <li><strong>No third-party sharing:</strong> We never share or sell any data because no data is collected or retained.</li>
            <li><strong>Self-hosted instances:</strong> If you self-host Slop Detector, ensure that your infrastructure logs and configurations meet your organization's privacy requirements.</li>
          </ul>

          </section>
        <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="privacy-web-app">
          <h2 id="privacy-web-app" className="text-2xl font-bold">5. Children's Privacy</h2>
          <p>
            Our services are intended for general audiences and do not target or collect any information from children under 13 years of age.
          </p>

          </section>
        <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="privacy-web-app">
          <h2 id="privacy-web-app" className="text-2xl font-bold">6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically to reflect technical or legal developments. 
            The “Last updated” date at the top of this page indicates when it was most recently revised. 
            Continued use of Slop Detector after any changes signifies your acceptance of the updated policy.
          </p>

          </section>
        <section className="glass-panel liquid-glow p-6 space-y-4" aria-labelledby="privacy-web-app">
          <h2 id="privacy-web-app" className="text-2xl font-bold">7. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle data, please contact us at:<br/>
            <strong>Email:</strong> privacy[@]slopdetector[.]com
          </p>
      </section>

    </main>
  );
}
