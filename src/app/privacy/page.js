'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: April 5, 2024</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Dodo Academy ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
          <p className="text-gray-700 leading-relaxed mt-2">
            By using our services, you consent to the data practices described in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">2. Information We Collect</h2>
          <h3 className="text-lg font-semibold mt-3 mb-2">Personal Information</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Name and contact information (email address, phone number)</li>
            <li>Billing and payment information (processed securely via Paystack)</li>
            <li>Account credentials (username and encrypted password)</li>
            <li>Profile information and learning progress</li>
            <li>Communications and inquiries you send to us</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-3 mb-2">Usage Data</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Course completion and assessment scores</li>
            <li>Pages visited and time spent on our platform</li>
            <li>Device and browser information</li>
            <li>IP address and location data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>To provide and maintain our courses and services</li>
            <li>To process payments and manage your enrollment</li>
            <li>To track your learning progress and issue certificates</li>
            <li>To communicate with you about your account and updates</li>
            <li>To improve our courses and user experience</li>
            <li>To send marketing communications (you can opt out at any time)</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">4. Information Sharing</h2>
          <p className="text-gray-700 leading-relaxed">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
            <li><strong>Service Providers:</strong> Paystack for payment processing, email service providers for communications</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">5. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your data, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
            <li>Encryption of sensitive data (passwords, payment information)</li>
            <li>Secure HTTPS connections</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication measures</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-2">
            However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">6. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your data (subject to legal obligations)</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-2">
            To exercise these rights, contact us at privacy@dodoacademy.ng.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">7. Cookies and Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies to enhance your experience, analyze usage, and personalize content. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">8. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our services are not intended for individuals under 16. We do not knowingly collect information from children under 16.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">9. International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your information may be transferred to and processed in countries other than Nigeria. We ensure appropriate safeguards are in place for such transfers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">10. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy periodically. We will notify you of significant changes via email or website notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0B1E33] mb-3">11. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <ul className="list-none text-gray-700 space-y-1 mt-2">
            <li><strong>Email:</strong> privacy@dodoacademy.ng</li>
            <li><strong>Address:</strong> Abuja, Nigeria</li>
            <li><strong>Phone:</strong> +234 800 123 4567</li>
          </ul>
        </section>
      </div>
    </div>
  );
}