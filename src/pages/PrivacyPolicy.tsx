import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{
        backgroundImage: 'url(/tile_background.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-8 md:p-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">1. Introduction</h2>
              <p className="text-foreground leading-relaxed">
                This Privacy Policy explains how Aiyu Japan, operated by Serrudo 合同会社 (Serrudo Gōdō Gaisha) ("we," "our," or "the Company"), collects, uses, and protects the personal information of users ("you," "your," or "the Client") who access our website or use our services.
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                By using Aiyu Japan's website or services, you agree to the practices described in this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">2. Operator Information</h2>
              <div className="space-y-2 text-foreground">
                <p><strong>Legal Company Name:</strong><br />Serrudo 合同会社 (Serrudo Gōdō Gaisha)</p>
                <p><strong>Trade Name:</strong><br />Aiyu Japan</p>
                <p><strong>Registered Address:</strong><br />〒532-0011<br />Osaka-fu, Osaka-shi, Yodogawa-ku, Nishinakajima 6-2-3<br />Chisan Mansion No.7 Shin-Osaka 903, Japan</p>
                <p><strong>Email:</strong> support@aiyujapan.com</p>
                <p><strong>Website:</strong> <a href="https://alpha.aiyujapan.com" className="text-capybara-orange hover:underline">https://alpha.aiyujapan.com</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">3. Information We Collect</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Aiyu Japan collects only the information necessary to operate our purchasing, storage, and shipping services effectively.
              </p>
              <p className="text-foreground leading-relaxed mb-2">We may collect:</p>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li><strong>Personal identification data:</strong> full name, address, phone number, email, and country of residence.</li>
                <li><strong>Order information:</strong> product links, shipping preferences, and related purchase details.</li>
                <li><strong>Payment information:</strong> transaction identifiers and billing details (handled securely via third-party processors).</li>
                <li><strong>Communication data:</strong> messages sent via our contact forms, email, or official support channels.</li>
                <li><strong>Technical data:</strong> IP address, device type, browser, and cookies (for analytics and website functionality).</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                We do not collect sensitive data such as personal IDs, tax numbers, or credit card numbers directly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">4. How We Use Your Information</h2>
              <p className="text-foreground leading-relaxed mb-2">Your personal data is used solely for the following purposes:</p>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li>To process and manage product purchases and shipments.</li>
                <li>To communicate with you regarding your orders, inquiries, or account.</li>
                <li>To issue invoices, receipts, and notifications related to payments.</li>
                <li>To improve our website experience and customer service.</li>
                <li>To comply with legal obligations under Japanese law.</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                Aiyu Japan does not sell, rent, or trade personal information to any third party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">5. Payment Processing</h2>
              <p className="text-foreground leading-relaxed mb-4">
                All payments are handled through secure and verified third-party payment providers, including Stripe, PayPal, Wise, and Japanese domestic banks.
              </p>
              <p className="text-foreground leading-relaxed">
                Aiyu Japan does not store or have access to your full credit card or bank account information. All payment data is encrypted and processed in accordance with the privacy policies of each payment provider.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">6. Data Storage and Retention</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Personal information is stored securely on servers located in Japan. We retain customer information only for as long as necessary to fulfill the purposes described above or as required by law.
              </p>
              <p className="text-foreground leading-relaxed">
                When data is no longer needed, it is deleted or anonymized in a secure manner.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">7. Data Sharing</h2>
              <p className="text-foreground leading-relaxed mb-2">Aiyu Japan may share minimal necessary information with:</p>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li>Shipping carriers (e.g., Japan Post, Yamato, DHL) to fulfill delivery.</li>
                <li>Payment processors (e.g., Stripe, PayPal, Wise) for payment verification.</li>
                <li>Legal authorities if required by law, regulation, or valid court order.</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                We do not share personal data for advertising or marketing purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">8. International Data Transfers</h2>
              <p className="text-foreground leading-relaxed">
                As an international service, some information may be transferred to or processed in countries outside Japan (e.g., when shipping to a customer's country). In such cases, we ensure appropriate security measures to protect personal data according to Japanese privacy law (APPI) and international standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">9. Cookies and Analytics</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Our website uses cookies to ensure proper functionality, security, and basic analytics. Cookies may collect anonymous data such as page visits, browser type, or session duration.
              </p>
              <p className="text-foreground leading-relaxed">
                You may disable cookies in your browser settings; however, some features of the website may not function properly without them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">10. User Rights</h2>
              <p className="text-foreground leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li>Request access to your personal data.</li>
                <li>Request correction or deletion of inaccurate information.</li>
                <li>Withdraw consent to the processing of your data.</li>
                <li>Request a copy of the data we hold about you (where applicable).</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                To exercise these rights, contact us at support@aiyujapan.com. We will respond to all valid requests in accordance with Japanese law and reasonable commercial practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">11. Data Security</h2>
              <p className="text-foreground leading-relaxed">
                Aiyu Japan employs physical, electronic, and administrative measures to safeguard personal data against unauthorized access, loss, or misuse. Despite our best efforts, no online system can guarantee absolute security, and users share information at their own discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">12. Updates to This Policy</h2>
              <p className="text-foreground leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our business, technology, or legal requirements. Any updates will be posted on this page with the revised date. Continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">13. Governing Law and Jurisdiction</h2>
              <p className="text-foreground leading-relaxed">
                This Privacy Policy is governed by the laws of Japan. Any disputes arising from or relating to this policy shall fall under the exclusive jurisdiction of the courts of Osaka, Japan.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">14. Contact</h2>
              <p className="text-foreground leading-relaxed mb-2">
                For any questions or requests related to your personal data, please contact:
              </p>
              <div className="text-foreground space-y-2 ml-4">
                <p><strong>Aiyu Japan (Serrudo Gōdō Gaisha)</strong></p>
                <p><strong>Email:</strong> support@aiyujapan.com</p>
                <p><strong>Website:</strong> <a href="https://alpha.aiyujapan.com" className="text-capybara-orange hover:underline">https://alpha.aiyujapan.com</a></p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
