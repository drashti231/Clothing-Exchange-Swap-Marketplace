import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function SwapGuidelines() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-brand-dark mb-6 text-center">Swap Guidelines</h1>
      <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
        To ensure a positive experience for everyone, we ask our community to follow these basic rules of swapping.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-8 h-8 text-brand-primary" />
            <h2 className="text-2xl font-bold text-text-main">Do's</h2>
          </div>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start"><span className="mr-2">•</span> <strong>Wash before you send.</strong> All clothes should be freshly laundered.</li>
            <li className="flex items-start"><span className="mr-2">•</span> <strong>Be honest about condition.</strong> Mention any stains, holes, or missing buttons in your listing.</li>
            <li className="flex items-start"><span className="mr-2">•</span> <strong>Pack securely.</strong> Protect the items from weather and damage during transit.</li>
            <li className="flex items-start"><span className="mr-2">•</span> <strong>Ship promptly.</strong> Try to send your items within 3 days of agreeing to a swap.</li>
            <li className="flex items-start"><span className="mr-2">•</span> <strong>Communicate clearly.</strong> Keep your swap partner updated, especially if there are delays.</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <XCircle className="w-8 h-8 text-danger-tag" />
            <h2 className="text-2xl font-bold text-text-main">Don'ts</h2>
          </div>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start"><span className="mr-2">•</span> <strong>No unwashed or dirty items.</strong> This is the golden rule of swapping.</li>
            <li className="flex items-start"><span className="mr-2">•</span> <strong>Don't misrepresent value.</strong> Be realistic about what your items are worth.</li>
            <li className="flex items-start"><span className="mr-2">•</span> <strong>No counterfeit goods.</strong> Only list authentic items.</li>
            <li className="flex items-start"><span className="mr-2">•</span> <strong>Don't ghost your partner.</strong> If you change your mind before shipping, let them know politely.</li>
            <li className="flex items-start"><span className="mr-2">•</span> <strong>No harassment or spam.</strong> Treat everyone in the community with respect.</li>
          </ul>
        </div>
      </div>

      <div className="bg-brand-light bg-opacity-20 p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-brand-dark mb-4">Item Conditions</h3>
        <p className="text-gray-700 mb-4">When listing an item, use these standard condition ratings:</p>
        <ul className="space-y-2 text-gray-600">
          <li><strong>New With Tags (NWT):</strong> Never worn, original tags still attached.</li>
          <li><strong>Excellent:</strong> Worn rarely, no visible flaws.</li>
          <li><strong>Good:</strong> Gently worn, minor signs of wear (e.g., slight pilling). Must be noted.</li>
          <li><strong>Fair:</strong> Loved and worn often. May have noticeable flaws like small stains or repairs. Must be clearly documented with photos.</li>
        </ul>
      </div>
    </div>
  );
}
