// Built-in fallback content for standard policy and legal pages
// Ensures these pages always load instantly even if backend/database is offline or unseeded.

export const staticPagesFallback = {
  "privacy-policy": {
    title: "Privacy Policy",
    slug: "privacy-policy",
    content: `
      <h2>1. Introduction & Overview</h2>
      <p>The terms "We", "Us", "Our", and "Company" refer to Cosmic Nidhi, and the terms "You", "Your", and "User" refer to the visitors and users of our website (<a href="https://www.cosmicnidhi.in">www.cosmicnidhi.in</a>). This Privacy Policy constitutes an electronic contract formed under the Information Technology Act, 2000 and the rules made thereunder. We are deeply committed to protecting your personal information and respecting your privacy.</p>
      <p>By accessing or using our Website, scheduling astrological consultations, or purchasing certified spiritual products and gemstone jewelry, you acknowledge that you have read, understood, and consented to the collection and use of your information as outlined in this policy.</p>

      <h2>2. User Information We Collect</h2>
      <p>To provide accurate astrological guidance and deliver authentic spiritual artifacts, we may collect the following personal information:</p>
      <ul>
        <li><strong>Identity & Contact Details:</strong> Full name, email address, WhatsApp/phone number, and shipping address.</li>
        <li><strong>Astrological & Birth Chart Data:</strong> Exact date of birth, time of birth, and place of birth (city, state, country) necessary for generating accurate Vedic horoscopes, Kundli charts, and planetary transit alignments.</li>
        <li><strong>Consultation Notes:</strong> Questions, life concerns, or areas of focus (career, relationships, health, spiritual growth) submitted voluntarily during session booking.</li>
        <li><strong>Transaction Details:</strong> Payment transaction references, order history, and billing records (payment card data is securely handled by RBI-compliant payment gateways and is never stored on our servers).</li>
      </ul>

      <h2>3. Sanctity & Confidentiality of Astrological Data</h2>
      <p>At Cosmic Nidhi, we treat birth chart information and personal consultation discussions with complete sanctity and confidentiality. Your personal birth parameters and session records are strictly restricted to our certified astrologers and consultants solely for the purpose of analyzing your horoscope and recommending spiritual or Vastu remedies. We never sell, rent, or publicly disclose your personal birth chart data to any third party.</p>

      <h2>4. Use of Information</h2>
      <p>We use the collected information for the following legitimate purposes:</p>
      <ul>
        <li>To prepare personalized Vedic astrology, Numerology, and Vastu consultations.</li>
        <li>To process, ship, and deliver energized gemstone and zodiac jewelry orders to your doorstep.</li>
        <li>To send transactional emails, appointment confirmations, reminder alerts, and customer support updates.</li>
        <li>To maintain site performance, security, and optimize user experience.</li>
      </ul>

      <h2>5. Cookies & Analytics</h2>
      <p>Our website utilizes standard session cookies to remember cart contents, login authentication state, and visitor preferences. These cookies do not extract personal files from your device. You may configure your browser to decline cookies, though certain interactive features of our store may be affected.</p>

      <h2>6. Information Sharing & Legal Compliance</h2>
      <p>We only share necessary customer data with trusted third-party service providers essential for operations:</p>
      <ul>
        <li><strong>Payment Processors:</strong> Secure, encrypted gateways (e.g., Razorpay) to complete financial transactions.</li>
        <li><strong>Logistics Partners:</strong> Certified courier services for shipping energized gemstone jewelry and sacred artifacts.</li>
        <li><strong>Legal Obligations:</strong> When strictly required by law enforcement or governmental authorities under valid legal processes.</li>
      </ul>

      <h2>7. Data Security Measures</h2>
      <p>We implement stringent technical and organizational security protocols, including SSL/TLS 256-bit encryption for all transmitted data, secure cloud database firewalls, and restricted role-based administrative access to protect against unauthorized access, loss, or alteration.</p>

      <h2>8. Updates to this Policy</h2>
      <p>We may periodically update this Privacy Policy to reflect changing legal requirements or improvements to our services. The date of the most recent revision will always be displayed at the bottom of this page.</p>

      <h2>9. Contact Us</h2>
      <p>If you have any questions, concerns, or requests regarding your personal data or privacy, please reach out to us at <a href="mailto:cosmicnidhi.astro@gmail.com">cosmicnidhi.astro@gmail.com</a> or message us on WhatsApp at +91 95604 37360.</p>

      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid rgba(90, 14, 20, 0.15); font-size: 13px; color: #6B3A2A;">
        <p><strong>Last Updated:</strong> September 2026</p>
        <p style="font-weight: 600; color: #3C080D; margin-top: 4px;">Cosmic Nidhi — Vedic Astrology & Vastu Consultation</p>
      </div>
    `
  },

  "terms-and-conditions": {
    title: "Terms and Conditions",
    slug: "terms-and-conditions",
    content: `
      <h2>1. Agreement to Terms</h2>
      <p>Welcome to Cosmic Nidhi (<a href="https://www.cosmicnidhi.in">www.cosmicnidhi.in</a>). By accessing this website, booking an astrology or Vastu consultation, or purchasing gemstone jewelry, you agree to comply with and be bound by the following Terms and Conditions, our Privacy Policy, and our Return & Refund Policy.</p>
      <p>If you do not agree with any part of these terms, please refrain from using our website and services.</p>

      <h2>2. Astrological Guidance & Spiritual Advice Disclaimer</h2>
      <p>Cosmic Nidhi provides personalized consultations based on traditional Vedic astrology, Numerology, and applied Vastu Shastra principles:</p>
      <ul>
        <li>Astrological assessments and horoscope readings represent spiritual perspectives, celestial guidance, and probability interpretations based on ancient wisdom.</li>
        <li>Consultations, birth chart interpretations, and gemstone recommendations are intended for personal guidance and spiritual enrichment. They do not constitute formal medical, psychiatric, financial, or legal advice.</li>
        <li>You retain complete personal agency and responsibility for all life decisions, business actions, and personal choices made subsequent to any consultation.</li>
      </ul>

      <h2>3. Product Descriptions & Gemstone Authenticity</h2>
      <p>We strive to accurately describe and present all certified gemstones, energized crystals, and spiritual jewelry. Because natural crystals and gemstones are organic earth minerals, slight natural variations in color, texture, and natural inclusions may occur, signifying authentic geological origins.</p>

      <h2>4. Consultations & Scheduling</h2>
      <p>Consultations are conducted online or telephonically at scheduled time slots. Clients are expected to provide accurate birth details (date, time, and location) prior to the appointment. Requests for slot rescheduling should be submitted at least 24 hours in advance through the user dashboard or WhatsApp support.</p>

      <h2>5. Pricing & Payments</h2>
      <p>All prices for consultations and gemstone artifacts are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless specified otherwise. Payment must be completed through our verified secure payment gateways (Razorpay, UPI) prior to consultation slot confirmation or order dispatch.</p>

      <h2>6. Intellectual Property</h2>
      <p>All content published on this website, including logos, graphics, celestial artwork, written articles, custom horoscopes, and calculator algorithms (including the Pitra Dosh Calculator), is the exclusive intellectual property of Cosmic Nidhi and protected under copyright laws. Reproduction without prior written authorization is strictly prohibited.</p>

      <h2>7. Limitation of Liability</h2>
      <p>To the maximum extent permitted by applicable law, Cosmic Nidhi, its practitioners, and associates shall not be liable for any indirect, incidental, consequential, or punitive damages arising from the use of our services or goods.</p>

      <h2>8. Governing Law & Jurisdiction</h2>
      <p>These terms and conditions are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to our services shall be subject to the exclusive jurisdiction of the competent courts in Noida / Uttar Pradesh, India.</p>

      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid rgba(90, 14, 20, 0.15); font-size: 13px; color: #6B3A2A;">
        <p><strong>Last Updated:</strong> September 2026</p>
        <p style="font-weight: 600; color: #3C080D; margin-top: 4px;">Cosmic Nidhi — Vedic Astrology & Vastu Consultation</p>
      </div>
    `
  },

  "return-policy": {
    title: "Return & Refund Policy",
    slug: "return-policy",
    content: `
      <h2>1. Overview</h2>
      <p>At Cosmic Nidhi, customer satisfaction with our sacred gemstones, authentic crystals, and spiritual consultations is paramount. This Return & Refund Policy outlines the terms governing cancellations, returns, and refunds for both physical goods and digital consultation services.</p>

      <h2>2. Physical Products (Zodiac Jewelry, Crystals & Gemstones)</h2>
      <p>We take immense care in energizing, inspecting, and packaging every physical item before dispatch. If you receive an item with an issue, our policy is as follows:</p>
      <ul>
        <li><strong>Eligibility for Replacement or Return:</strong> You may request a return or replacement within <strong>7 days</strong> of delivery if the product was damaged during transit or possesses a verified manufacturing defect.</li>
        <li><strong>Condition:</strong> To qualify, the item must be unused, unaltered, in its original packaging, and accompanied by the certificate of authenticity and purchase invoice.</li>
        <li><strong>How to Initiate:</strong> Contact our support team on WhatsApp (+91 95604 37360) or email <a href="mailto:cosmicnidhi.astro@gmail.com">cosmicnidhi.astro@gmail.com</a> with photographs or an unboxing video showing the damage.</li>
      </ul>

      <h2>3. Astrological Consultations & Personalized Reports</h2>
      <p>Consultations, Kundli analysis, and customized birth chart preparations require dedicated time, specialized calculations, and spiritual analysis by our astrologers:</p>
      <ul>
        <li>Once a personalized consultation has taken place or a custom astrological report has been generated and delivered, the fee is <strong>non-refundable</strong>.</li>
        <li>If you need to reschedule an upcoming appointment, you may do so at least 24 hours prior to your scheduled time via your account dashboard or by messaging support.</li>
        <li>If a consultation cannot be conducted due to an unavoidable technical issue or practitioner unavailability, you will be offered the option to either reschedule at your preferred time or receive a 100% full refund.</li>
      </ul>

      <h2>4. Order Cancellation</h2>
      <p>Orders for physical items (gemstones, rings, bracelets) can be cancelled free of charge before the package has been handed over to our shipping courier. Once dispatched, orders cannot be cancelled mid-transit and must follow the standard return process upon arrival.</p>

      <h2>5. Refund Processing Timelines</h2>
      <p>Once an approved returned product is received and inspected at our Noida fulfillment center, your refund will be initiated immediately. Refunds are processed back to the original method of payment (bank account, UPI, credit/debit card) and typically reflect within <strong>5 to 7 business days</strong> depending on your bank's processing cycle.</p>

      <h2>6. Support & Inquiries</h2>
      <p>For any questions regarding returns, exchanges, or refunds, our customer support team is available:</p>
      <ul>
        <li><strong>WhatsApp:</strong> +91 95604 37360</li>
        <li><strong>Email:</strong> <a href="mailto:cosmicnidhi.astro@gmail.com">cosmicnidhi.astro@gmail.com</a></li>
        <li><strong>Office:</strong> A-56/1, 4th Floor, Sector 50, Noida, Uttar Pradesh 201301</li>
      </ul>

      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid rgba(90, 14, 20, 0.15); font-size: 13px; color: #6B3A2A;">
        <p><strong>Last Updated:</strong> September 2026</p>
        <p style="font-weight: 600; color: #3C080D; margin-top: 4px;">Cosmic Nidhi — Vedic Astrology & Vastu Consultation</p>
      </div>
    `
  }
};

// Aliases for interchangeable routing
staticPagesFallback["terms"] = staticPagesFallback["terms-and-conditions"];
staticPagesFallback["terms-conditions"] = staticPagesFallback["terms-and-conditions"];
staticPagesFallback["terms-of-service"] = staticPagesFallback["terms-and-conditions"];
staticPagesFallback["privacy"] = staticPagesFallback["privacy-policy"];
staticPagesFallback["refund-policy"] = staticPagesFallback["return-policy"];
staticPagesFallback["returns"] = staticPagesFallback["return-policy"];
staticPagesFallback["cancellation-policy"] = staticPagesFallback["return-policy"];

