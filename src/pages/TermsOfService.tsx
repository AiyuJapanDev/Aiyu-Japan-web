import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TermsOfService = () => {
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
            <h1 className="text-4xl font-bold text-primary mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: October 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Operator Information</h2>
              <div className="space-y-2 text-foreground">
                <p><strong>Legal Company Name:</strong><br />Serrudo 合同会社 (Serrudo Gōdō Gaisha)</p>
                <p><strong>Trade Name:</strong><br />Aiyu Japan</p>
                <p><strong>Registered Address:</strong><br />〒532-0011<br />Osaka-fu, Osaka-shi, Yodogawa-ku, Nishinakajima 6-2-3<br />Chisan Mansion No. 7 Shin-Osaka 903, Japan</p>
                <p><strong>Legal Representative:</strong><br />Alexander Serrudo</p>
                <p><strong>Email:</strong><br />support@aiyujapan.com</p>
                <p><strong>Official Website:</strong><br /><a href="https://alpha.aiyujapan.com" className="text-capybara-orange hover:underline">https://alpha.aiyujapan.com</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">General Description of the Service</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Aiyu Japan is an international purchasing and shipping service that connects customers from all continents of the world with stores and products in Japan. We act as a trusted intermediary, purchasing products on behalf of clients, storing them, and managing international shipping from Japan to their destination country.
              </p>
              <p className="text-foreground leading-relaxed">
                The service is intended exclusively for international export use. Aiyu Japan may not be used for domestic deliveries within Japan or for local commercial resale without prior authorization.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Definition of User</h2>
              <p className="text-foreground leading-relaxed mb-2">The term "User" or "Client" refers to any individual or legal entity that:</p>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li>Has read and accepted these Terms of Service.</li>
                <li>Requests to use the services offered by Aiyu Japan.</li>
                <li>Has been approved by Aiyu Japan's team as a valid client.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Purchase and Management Process</h2>
              <ol className="list-decimal list-inside text-foreground space-y-2 ml-4">
                <li>The client submits the product links they wish to purchase.</li>
                <li>Aiyu Japan purchases the items on behalf of the client and provides a total cost including the product value, service fees, and shipping costs.</li>
                <li>The purchased items are received, stored, and consolidated at our Osaka facility until the client requests international shipment.</li>
                <li>Once payment is confirmed, the shipment is arranged through the selected carrier.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Payments</h2>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li>Payments must be made using the officially accepted methods: Stripe, PayPal, credit card, Wise, or bank transfer.</li>
                <li>All prices and charges are expressed exclusively in Japanese yen (JPY).</li>
                <li>Orders will only be processed once full payment has been confirmed.</li>
                <li>Transaction fees charged by payment platforms are non-refundable.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Prohibited Products</h2>
              <p className="text-foreground leading-relaxed mb-4">
                For safety reasons and in compliance with Japanese and international laws, Aiyu Japan does not accept or handle the following items:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li>Illegal substances, narcotics, drugs, or stimulants.</li>
                <li>Weapons, knives, ammunition, explosives, or hazardous materials.</li>
                <li>Perishable goods (food, beverages, etc.).</li>
                <li>Medical or pharmaceutical equipment and supplies.</li>
                <li>Obscene or illegal materials.</li>
                <li>Items containing compressed gas or powerful magnets.</li>
                <li>Products containing lithium batteries (except via approved carriers).</li>
                <li>Any items that violate export or import regulations in Japan or in the destination country.</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                If a package contains restricted or prohibited goods, Aiyu Japan reserves the right to hold or return the shipment without refund and may report the case to the relevant authorities if necessary.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Receipt, Storage, and Shipping</h2>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li>Packages received at our facility are not opened or inspected unless required for safety or packaging reasons.</li>
                <li>Aiyu Japan may adjust packaging or consolidate items to optimize shipping cost and security.</li>
                <li>We do not perform internal inspections or modifications of the products.</li>
                <li>Once a shipment leaves Japan, Aiyu Japan is not responsible for delays, damages, or customs retention, as control passes to the carrier and the destination country's authorities.</li>
                <li>All import taxes, duties, and customs-related charges are the client's responsibility.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Cancellations and Refunds</h2>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li>Once a purchase is confirmed, cancellations and refunds are not accepted, except in exceptional cases reviewed and approved by our team.</li>
                <li>If a refund is approved, operational costs, service fees, and payment platform commissions already incurred will be deducted.</li>
                <li>Refunds may take several business days to process depending on the payment method used.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Limitation of Liability</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Aiyu Japan acts solely as an intermediary for purchases and international logistics, not as a seller, manufacturer, or official distributor of the purchased items. Therefore, Aiyu Japan is not liable for:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li>Defects, discrepancies, or faults in the purchased products.</li>
                <li>Delays, losses, or damages caused by carriers, customs, or third parties.</li>
                <li>Additional costs resulting from taxes, duties, or customs regulations in the destination country.</li>
                <li>Errors or incorrect information provided by the client (such as name, address, or postal code).</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                The client is solely responsible for confirming that the product meets their expectations before requesting the purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Service Refusal or Suspension</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Aiyu Japan may suspend, limit, or refuse service in the following cases:
              </p>
              <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                <li>Improper, fraudulent, or suspicious use of the service.</li>
                <li>Failure to complete payment or comply with deadlines.</li>
                <li>Requests or shipments involving prohibited products.</li>
                <li>Inappropriate communication or disrespectful behavior toward staff.</li>
                <li>Any situation that threatens the integrity, operations, or reputation of Aiyu Japan.</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                In such cases, Aiyu Japan reserves the right to cancel active orders, deny new ones, and/or permanently close the client's account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Modifications to the Terms</h2>
              <p className="text-foreground leading-relaxed">
                Aiyu Japan reserves the right to update or modify these Terms of Service at any time without prior individual notice. Updated versions will be published on the official website. Continued use of the service implies acceptance of the latest version of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Governing Law and Jurisdiction</h2>
              <p className="text-foreground leading-relaxed">
                These Terms are governed by the laws of Japan. Any disputes arising from or relating to the use of Aiyu Japan's services shall be subject to the exclusive jurisdiction of the competent courts of Osaka, Japan.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Contact</h2>
              <p className="text-foreground leading-relaxed mb-2">
                For any inquiries related to these Terms of Service or the use of our services, please contact:
              </p>
              <div className="text-foreground space-y-2 ml-4">
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

export default TermsOfService;
