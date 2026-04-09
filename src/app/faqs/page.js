'use client';

import { useState } from 'react';

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      category: "General Questions",
      icon: "🏠",
      faqs: [
        {
          q: "What is Dodo Academy?",
          a: "Dodo Academy is a Nigerian cybersecurity training platform focused on protecting critical infrastructure. We offer foundational courses in cybersecurity fundamentals and specialized training in areas like network security, ethical hacking, cryptography, and critical infrastructure protection."
        },
        {
          q: "Who is Dodo Academy for?",
          a: "Our courses are designed for: • Beginners with no prior cybersecurity experience • IT professionals looking to upskill • Government agency staff • Bank security teams • Telecom engineers • Anyone interested in protecting Nigeria's digital infrastructure"
        },
        {
          q: "Is Dodo Academy accredited?",
          a: "Our curriculum aligns with global standards including NIST Cybersecurity Framework, ISO 27001, and CIS Controls. We are actively working with NITDA and other Nigerian regulatory bodies for formal accreditation."
        },
        {
          q: "Do I need any prior experience?",
          a: "No prior cybersecurity experience is required for the Foundation Course. We start with basic concepts and build up gradually. Basic computer literacy is helpful. For the Critical Infrastructure Protection program, some IT background is recommended."
        }
      ]
    },
    {
      category: "Courses & Learning",
      icon: "📚",
      faqs: [
        {
          q: "What is included in the Cybersecurity Foundation course?",
          a: "The Foundation Course includes 5 comprehensive modules: • Introduction to Cybersecurity • Network Security Fundamentals • Cryptography Basics • Ethical Hacking Basics • Final Assessment. You'll get lifetime access to all materials, progress tracking, and a digital certificate upon completion."
        },
        {
          q: "How long does it take to complete the course?",
          a: "The course is self-paced. Most students complete it in 2-4 weeks, studying 5-10 hours per week. You can go faster or slower based on your schedule. You have lifetime access, so there's no pressure to finish quickly."
        },
        {
          q: "What happens after I complete the course?",
          a: "After completing all lessons and passing the final assessment (16/20), you'll receive a digital certificate via email. You'll also be eligible for our advanced Critical Infrastructure Protection program and receive job placement assistance."
        },
        {
          q: "Can I access the course on mobile devices?",
          a: "Yes! Our platform is fully responsive and works on smartphones, tablets, laptops, and desktop computers. You can learn anytime, anywhere."
        }
      ]
    },
    {
      category: "Payment & Pricing",
      icon: "💰",
      faqs: [
        {
          q: "How much does the Cybersecurity Foundation course cost?",
          a: "The Foundation Course costs ₦50,000 (one-time payment). This includes lifetime access to all materials, progress tracking, digital certificate, and future updates. There are no hidden fees or recurring charges."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept payments via Paystack, which supports: • Credit/Debit cards (Visa, Mastercard, Verve) • Bank transfers • USSD • Mobile money • All major Nigerian banks"
        },
        {
          q: "Is there a refund policy?",
          a: "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with the course, contact our support team within 7 days of purchase for a full refund. No questions asked."
        },
        {
          q: "Do you offer discounts for students or groups?",
          a: "Yes! We offer: • 20% discount for students with valid ID • Group discounts for teams of 5+ • Corporate training packages. Contact our sales team for custom pricing."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: "🛠️",
      faqs: [
        {
          q: "What technology do I need?",
          a: "You need: • A computer or mobile device with internet access • Modern web browser (Chrome, Firefox, Safari, or Edge) • No special software is required for the Foundation Course. For advanced courses, we provide virtual lab access."
        },
        {
          q: "How do I access my courses?",
          a: "After purchase, log into your account and go to the Dashboard. All your enrolled courses and progress will be displayed there. You can access them anytime, anywhere."
        },
        {
          q: "I forgot my password. What should I do?",
          a: "Click the 'Forgot Password' link on the login page. Enter your email address, and you'll receive instructions to reset your password. If you don't receive the email, check your spam folder."
        },
        {
          q: "Who do I contact for technical issues?",
          a: "Email our support team at support@dodoacademy.ng or use the contact form on our website. We typically respond within 24 hours. For urgent issues, call +234 800 123 4567."
        }
      ]
    },
    {
      category: "Certification",
      icon: "📜",
      faqs: [
        {
          q: "Will I receive a certificate after completing the course?",
          a: "Yes! After passing the final assessment (scoring 16/20 or higher), you'll receive a digital certificate via email. You can download and share it on LinkedIn, add to your resume, or print it."
        },
        {
          q: "Is the certificate recognized by employers?",
          a: "Our certificate demonstrates your foundational knowledge in cybersecurity. Many employers in Nigeria recognize our training, especially those focused on critical infrastructure protection, banking, telecom, and government sectors."
        },
        {
          q: "How can I verify my certificate?",
          a: "Each certificate has a unique ID. Employers can verify your certificate by entering the ID on our verification page at https://dodoacademy.ng/verify. This ensures authenticity."
        },
        {
          q: "Can I get a physical copy of my certificate?",
          a: "We provide digital certificates that can be printed. If you need an official hard copy for professional purposes, contact our support team for arrangements (additional fees may apply)."
        }
      ]
    },
    {
      category: "Partnerships & Enterprise",
      icon: "🤝",
      faqs: [
        {
          q: "Do you offer corporate training?",
          a: "Yes! We provide customized training programs for organizations. Our corporate training includes: • On-site workshops • Custom curriculum development • Team assessments • Progress reporting. Contact our consultancy team for a tailored proposal."
        },
        {
          q: "How can my organization partner with Dodo Academy?",
          a: "We welcome partnerships with: • Government agencies • Educational institutions • Private companies • NGOs. Email partnerships@dodoacademy.ng to discuss opportunities, including custom programs, research collaboration, and internship placements."
        },
        {
          q: "Do you offer internship opportunities?",
          a: "Yes! We partner with organizations to place our top graduates in internship positions. Contact our career services team for current opportunities."
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[#0B1E33]">Frequently Asked Questions</h1>
        <div className="w-20 h-1 bg-[#FFB347] mx-auto"></div>
        <p className="text-gray-600 mt-4">Find answers to common questions about Dodo Academy</p>
      </div>

      {faqCategories.map((category, catIndex) => (
        <div key={catIndex} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{category.icon}</span>
            <h2 className="text-2xl font-bold text-[#0B1E33]">{category.category}</h2>
          </div>
          <div className="space-y-3">
            {category.faqs.map((faq, faqIndex) => {
              const globalIndex = `${catIndex}-${faqIndex}`;
              const isOpen = openIndex === globalIndex;
              
              return (
                <div key={faqIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    className="w-full text-left p-5 font-semibold text-lg text-[#0B1E33] hover:bg-gray-50 transition flex justify-between items-center"
                  >
                    <span>{faq.q}</span>
                    <span className="text-2xl text-[#FFB347]">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-3 whitespace-pre-line">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Still have questions section */}
      <div className="mt-12 bg-gradient-to-r from-[#0B1E33] to-[#1A3A5F] text-white rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
        <p className="mb-4">We're here to help. Contact our support team.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="mailto:support@dodoacademy.ng" className="bg-[#FFB347] text-[#0B1E33] px-6 py-2 rounded-full font-semibold hover:bg-[#FFC97A] transition">
            Email Support
          </a>
          <a href="/critical" className="border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-[#0B1E33] transition">
            Contact Form
          </a>
        </div>
      </div>
    </div>
  );
}