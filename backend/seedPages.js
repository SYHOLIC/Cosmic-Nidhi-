const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('./src/models/Page');

const pages = [
  {
    title: 'About Us',
    slug: 'about-us',
    content: '<h1 class="text-3xl font-bold mb-4 text-[#3C080D]">About Cosmic Nidhi</h1><p class="mb-4">Welcome to Cosmic Nidhi! We are dedicated to bringing you the finest zodiac jewelry, authentic crystals, and reliable astrology services.</p><p>Our mission is to align your spiritual energy with beautiful, hand-crafted artifacts that resonate with your star sign.</p>',
    isActive: true
  },
  {
    title: 'FAQ',
    slug: 'faq',
    content: '<h1 class="text-3xl font-bold mb-4 text-[#3C080D]">Frequently Asked Questions</h1><h3 class="text-xl font-bold mt-4 mb-2 text-[#E9A534]">How long does shipping take?</h3><p class="mb-4">Shipping usually takes 3-5 business days across India.</p><h3 class="text-xl font-bold mt-4 mb-2 text-[#E9A534]">Are your crystals authentic?</h3><p>Yes, all our crystals are 100% natural, unheated, and lab-certified.</p>',
    isActive: true
  },
  {
    title: 'Terms and Conditions',
    slug: 'terms-and-conditions',
    content: '<h1 class="text-3xl font-bold mb-4 text-[#3C080D]">Terms and Conditions</h1><p class="mb-4">By using this website, you agree to our terms of service.</p><p>Prices are subject to change. All sales of custom astrological reports are final.</p>',
    isActive: true
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: `<h2 class="text-2xl font-bold mb-4 text-[#3C080D]">Introduction</h2>
<p class="mb-4 leading-relaxed">The terms &ldquo;We&rdquo; / &ldquo;Us&rdquo; / &ldquo;Our&rdquo; / &ldquo;Company&rdquo; individually and collectively refer to Cosmic Nidhi and the terms &ldquo;You&rdquo; / &ldquo;Your&rdquo; / &ldquo;Yourself&rdquo; refer to the users. This Privacy Policy is an electronic record in the form of an electronic contract formed under the Information Technology Act, 2000 and the rules made thereunder and the amended provisions pertaining to electronic documents / records in various statutes as amended by the Information Technology Act, 2000. This Privacy Policy does not require any physical, electronic or digital signature.</p>

<p class="mb-4 leading-relaxed">This Privacy Policy is a legally binding document between you and Cosmic Nidhi (both terms defined below). The terms of this Privacy Policy will be effective upon your acceptance of the same (directly or indirectly in electronic form, by clicking on the &ldquo;I accept&rdquo; tab or by use of the website or by other means) and will govern the relationship between you and Cosmic Nidhi for your use of the website &ldquo;Website&rdquo; (www.cosmicnidhi.com).</p>

<p class="mb-4 leading-relaxed">This document is published and shall be construed in accordance with the provisions of the Information Technology (reasonable security practices and procedures and sensitive personal data of information) rules, 2011 under Information Technology Act, 2000; that require publishing of the Privacy Policy for collection, use, storage and transfer of sensitive personal data or information.</p>

<p class="mb-4 leading-relaxed">Please read this Privacy Policy carefully by using the Website, you indicate that you understand, agree and consent to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not use this Website.</p>

<p class="mb-4 leading-relaxed">By providing us your Information or by making use of the facilities provided by the Website, You hereby consent to the collection, storage, processing and transfer of any or all of Your Personal Information and Non-Personal Information by us as specified under this Privacy Policy. You further agree that such collection, use, storage and transfer of Your Information shall not cause any loss or wrongful gain to you or any other person.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">User Information Collection</h2>
<p class="mb-3 leading-relaxed">To avail certain services on our Websites (including purchasing zodiac jewelry, authentic energized crystals, scheduling astrological consultations, or generating personalized birth charts and horoscopes), users are required to provide certain information for the registration and service delivery process namely:</p>
<ul class="list-disc pl-6 space-y-1 mb-4 leading-relaxed">
  <li>your name</li>
  <li>email address</li>
  <li>phone or WhatsApp contact number</li>
  <li>sex</li>
  <li>age &amp; date of birth</li>
  <li>time of birth &amp; place of birth (for accurate planetary alignment and Kundli calculations)</li>
  <li>PIN code &amp; shipping address (for physical delivery of zodiac jewelry and gemstone products)</li>
  <li>credit card or debit card details (securely routed via encrypted payment processors)</li>
  <li>medical records and history (if shared voluntarily for astrological remedy recommendations)</li>
  <li>sexual orientation</li>
  <li>biometric information</li>
  <li>password etc., and / or your occupation, interests, and the like</li>
</ul>
<p class="mb-4 leading-relaxed">The Information as supplied by the users enables us to improve our sites, process your orders, provide accurate celestial consultations, and provide you the most user-friendly experience. All required information is service dependent and we may use the above said user information to maintain, protect, and improve its services (including advertising services) and for developing new services. Such information will not be considered as sensitive if it is freely available and accessible in the public domain or is furnished under the Right to Information Act, 2005 or any other law for the time being in force.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Confidentiality of Astrological &amp; Birth Data</h2>
<p class="mb-4 leading-relaxed">At Cosmic Nidhi, we treat birth chart details, horoscopic data, and personal astrological consultations with utmost respect and sanctity. Your exact date, time, and location of birth, alongside the notes of private consultations with our astrologers, are stored securely and used exclusively for your spiritual, horoscopic, and gemstone guidance.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Use of Cookies</h2>
<h3 class="text-lg font-semibold mt-4 mb-2 text-[#E9A534]">(A) Security Rules</h3>
<p class="mb-4 leading-relaxed">To improve the responsiveness of the sites for our users, we may use &ldquo;cookies&rdquo;, or similar electronic tools to collect information to assign each visitor a unique, random number as a User Identification (User ID) to understand the user&rsquo;s individual interests using the Identified Computer. Unless you voluntarily identify yourself (through registration, for example), we will have no way of knowing who you are, even if we assign a cookie to your computer. The only personal information a cookie can contain is information you supply (an example of this is when you ask for our Personalised Horoscope). A cookie cannot read data off your hard drive. Our advertisers may also assign their own cookies to your browser (if you click on their ads), a process that we do not control.</p>

<p class="mb-4 leading-relaxed">Our web servers automatically collect limited information about your computer&rsquo;s connection to the Internet, including your IP address, when you visit our site. (Your IP address is a number that lets computers attached to the Internet know where to send you data &mdash; such as the web pages you view.) Your IP address does not identify you personally. We use this information to deliver our web pages to you upon request, to tailor our site to the interests of our users, to measure traffic within our site and let advertisers know the geographic locations from where our visitors come.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Links to Other Websites</h2>
<p class="mb-4 leading-relaxed">Our policy discloses the privacy practices for our own web site only. Our site provides links to other websites also that are beyond our control. We shall in no way be responsible in way for your use of such sites.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Information Sharing with Third Parties</h2>
<p class="mb-3 leading-relaxed">We share the sensitive personal information to any third party without obtaining the prior consent of the user in the following limited circumstances:</p>
<ul class="list-disc pl-6 space-y-2 mb-4 leading-relaxed">
  <li><strong>(a)</strong> When it is requested or required by law or by any court or governmental agency or authority to disclose, for the purpose of verification of identity, or for the prevention, detection, investigation including cyber incidents, or for prosecution and punishment of offences. These disclosures are made in good faith and belief that such disclosure is reasonably necessary for enforcing these Terms; for complying with the applicable laws and regulations.</li>
  <li><strong>(b)</strong> We propose to share such information within its group companies and officers and employees of such group companies for the purpose of processing personal information on its behalf. We also ensure that these recipients of such information agree to process such information based on our instructions and in compliance with this Privacy Policy and any other appropriate confidentiality and security measures.</li>
</ul>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Information Security</h2>
<p class="mb-4 leading-relaxed">We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure or destruction of data. These include internal reviews of our data collection, storage and processing practices and security measures, including appropriate encryption and physical security measures to guard against unauthorized access to systems where we store personal data. All information gathered on our Website is securely stored within our controlled database. The database is stored on servers secured behind a firewall; access to the servers is password-protected and is strictly limited.</p>

<p class="mb-4 leading-relaxed">However, as effective as our security measures are, no security system is impenetrable. We cannot guarantee the security of our database, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet. And, of course, any information you include in a posting to the discussion areas is available to anyone with Internet access. However the internet is an ever evolving medium. We may change our Privacy Policy from time to time to incorporate necessary future changes. Of course, our use of any information we gather will always be consistent with the policy under which the information was collected, regardless of what the new policy may be.</p>

<div class="mt-10 pt-6 border-t border-[#5A0E14]/15 text-sm text-[#6B3A2A]/80 font-medium">
  <p><strong>Last Updated:</strong> 9/19/2026</p>
  <p class="text-[#3C080D] font-semibold mt-1">Cosmic Nidhi</p>
</div>`,
    isActive: true
  },
  {
    title: 'Return Policy',
    slug: 'return-policy',
    content: `<h2 class="text-2xl font-bold mb-4 text-[#3C080D]">Introduction</h2>
<p class="mb-4 leading-relaxed">The terms &ldquo;We&rdquo; / &ldquo;Us&rdquo; / &ldquo;Our&rdquo; / &ldquo;Company&rdquo; individually and collectively refer to Cosmic Nidhi and the terms &ldquo;Visitor&rdquo; / &ldquo;User&rdquo; refer to the users. This page states the Terms, Conditions, and Return Policies under which you (Visitor) may visit and make purchases on this website (&ldquo;www.cosmicnidhi.com&rdquo;). Please read this page carefully. If you do not accept the Terms and Conditions stated here, we would request you to exit this site.</p>

<p class="mb-4 leading-relaxed">The business, any of its business divisions and / or its subsidiaries, associate companies or subsidiaries to subsidiaries or such other investment companies (in India or abroad) reserve their respective rights to revise these Terms and Conditions at any time by updating this posting. You should visit this page periodically to re-appraise yourself of the Terms and Conditions, because they are binding on all users of this Website.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Use of Website Content</h2>
<p class="mb-4 leading-relaxed">All logos, brands, marks headings, labels, names, signatures, numerals, shapes or any combinations thereof, appearing in this site, except as otherwise noted, are properties either owned, or used under licence, by the business and / or its associate entities who feature on this Website. The use of these properties or any other content on this site, except as provided in these terms and conditions or in the site content, is strictly prohibited.</p>

<p class="mb-4 leading-relaxed">You may not sell or modify the content of this Website or reproduce, display, publicly perform, distribute, or otherwise use the materials in any way for any public or commercial purpose without the respective organisation's or entity's written permission.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Acceptable Website Use</h2>
<h3 class="text-lg font-semibold mt-4 mb-2 text-[#E9A534]">(A) Security Rules</h3>
<p class="mb-3 leading-relaxed">Visitors are prohibited from violating or attempting to violate the security of the Web site, including, without limitation:</p>
<ul class="list-disc pl-6 space-y-1 mb-4 leading-relaxed">
  <li>(1) accessing data not intended for such user or logging into a server or account which the user is not authorised to access</li>
  <li>(2) attempting to probe, scan or test the vulnerability of a system or network or to breach security or authentication measures without proper authorisation</li>
  <li>(3) attempting to interfere with service to any user, host or network, including, without limitation, via means of submitting a virus or &ldquo;Trojan horse&rdquo; to the Website, overloading, &ldquo;flooding&rdquo;, &ldquo;mail bombing&rdquo; or &ldquo;crashing&rdquo;</li>
  <li>(4) sending unsolicited electronic mail, including promotions and/or advertising of products or services</li>
</ul>
<p class="mb-4 leading-relaxed">Violations of system or network security may result in civil or criminal liability. The business and / or its associate entities will have the right to investigate occurrences that they suspect as involving such violations and will have the right to involve, and cooperate with, law enforcement authorities in prosecuting users who are involved in such violations.</p>

<h3 class="text-lg font-semibold mt-6 mb-2 text-[#E9A534]">(B) General Rules</h3>
<p class="mb-3 leading-relaxed">Visitors may not use the Web Site in order to transmit, distribute, store or destroy material:</p>
<ul class="list-disc pl-6 space-y-1 mb-4 leading-relaxed">
  <li>(a) that could constitute or encourage conduct that would be considered a criminal offence or violate any applicable law or regulation</li>
  <li>(b) in a manner that will infringe the copyright, trademark, trade secret or other intellectual property rights of others or violate the privacy or publicity of other personal rights of others</li>
  <li>(c) that is libellous, defamatory, pornographic, profane, obscene, threatening, abusive or hateful</li>
</ul>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Returns, Refunds & Cancellations Policy</h2>
<p class="mb-4 leading-relaxed">At Cosmic Nidhi, customer satisfaction with our genuine zodiac products and spiritual services is of paramount importance. Our policy regarding returns and refunds is as follows:</p>
<ul class="list-disc pl-6 space-y-2 mb-4 leading-relaxed">
  <li><strong>Physical Products (Jewelry, Gemstones & Crystals):</strong> Eligible for return or replacement within 7 days of delivery in the event of manufacturing defect or transit damage. Items must remain unused, unaltered, and retained in original packaging with proof of purchase.</li>
  <li><strong>Astrological Consultation & Personalized Reports:</strong> Because consultations, kundli readings, and birth chart preparations involve dedicated astrologer time and custom analysis, these services are non-refundable once performed or scheduled.</li>
  <li><strong>Cancellation:</strong> Orders for physical goods may be cancelled before dispatch by contacting customer support.</li>
</ul>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Indemnity</h2>
<p class="mb-4 leading-relaxed">The User unilaterally agree to indemnify and hold harmless, without objection, the Company, its officers, directors, employees and agents from and against any claims, actions and/or demands and/or liabilities and/or losses and/or damages whatsoever arising from or resulting from their use of www.cosmicnidhi.com or their breach of the terms.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Liability</h2>
<p class="mb-4 leading-relaxed">User agrees that neither Company nor its group companies, directors, officers or employee shall be liable for any direct or/and indirect or/and incidental or/and special or/and consequential or/and exemplary damages, resulting from the use or/and the inability to use the service or/and for cost of procurement of substitute goods or/and services or resulting from any goods or/and data or/and information or/and services purchased or/and obtained or/and messages received or/and transactions entered into through or/and from the service or/and resulting from unauthorized access to or/and alteration of user's transmissions or/and data or/and arising from any other matter relating to the service, including but not limited to, damages for loss of profits or/and use or/and data or other intangible, even if Company has been advised of the possibility of such damages.</p>

<p class="mb-4 leading-relaxed">User further agrees that Company shall not be liable for any damages arising from interruption, suspension or termination of service, including but not limited to direct or/and indirect or/and incidental or/and special consequential or/and exemplary damages, whether such interruption or/and suspension or/and termination was justified or not, negligent or intentional, inadvertent or advertent.</p>

<p class="mb-4 leading-relaxed">User agrees that Company shall not be responsible or liable to user, or anyone, for the statements or conduct of any third party of the service. In sum, in no event shall Company's total liability to the User for all damages or/and losses or/and causes of action exceed the amount paid by the User to Company, if any, that is related to the cause of action.</p>

<h2 class="text-2xl font-bold mt-8 mb-4 text-[#3C080D]">Disclaimer of Consequential Damages</h2>
<p class="mb-4 leading-relaxed">In no event shall Company or any parties, organizations or entities associated with the corporate brand name us or otherwise, mentioned at this Website be liable for any damages whatsoever (including, without limitations, incidental and consequential damages, lost profits, or damage to computer hardware or loss of data information or business interruption) resulting from the use or inability to use the Website and the Website material, whether based on warranty, contract, tort, or any other legal theory, and whether or not, such organization or entities were advised of the possibility of such damages.</p>

<div class="mt-10 pt-6 border-t border-[#5A0E14]/15 text-sm text-[#6B3A2A]/80 font-medium">
  <p><strong>Last Updated:</strong> 9/19/2026</p>
  <p class="text-[#3C080D] font-semibold mt-1">Cosmic Nidhi</p>
</div>`,
    isActive: true
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    for (let page of pages) {
      await Page.findOneAndUpdate({ slug: page.slug }, page, { upsert: true });
      console.log(`Upserted page: ${page.slug}`);
    }
    console.log('Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
