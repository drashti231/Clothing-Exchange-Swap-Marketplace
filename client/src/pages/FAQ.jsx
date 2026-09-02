import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "Is it really free to swap?",
    answer: "Joining ReWear and listing items is completely free. When you arrange a swap, you are only responsible for the shipping costs of the item you send."
  },
  {
    question: "How do I calculate shipping costs?",
    answer: "Shipping costs depend on your location and the weight of the package. We recommend using a local post office or a reliable courier service. Discuss the shipping method with your swap partner beforehand."
  },
  {
    question: "What if the item I receive isn't as described?",
    answer: "If you receive an item that significantly differs from its description, try to resolve it with the swapper first. If you can't reach an agreement, contact our Support team with photos, and we will mediate the dispute based on our Trust & Safety policies."
  },
  {
    question: "Can I swap internationally?",
    answer: "Currently, ReWear supports domestic swaps within your country to keep shipping costs and carbon footprints low. We plan to expand to regional swapping in the future."
  },
  {
    question: "Do I have to swap item for item (1-for-1)?",
    answer: "Not necessarily! You can negotiate any trade that feels fair to both parties. For example, you might trade two lower-value t-shirts for one higher-value jacket."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-brand-dark mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-lg text-gray-600 mb-10 text-center">
        Have a question? We're here to help. Find answers to common queries below.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold text-text-main">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-danger-tag flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-brand-primary flex-shrink-0" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4 pt-2 text-gray-600 border-t border-gray-100 bg-gray-50">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <Link to="/contact-us" className="inline-block bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-dark transition">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
