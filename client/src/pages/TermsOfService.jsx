import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-brand-primary/10">
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-100">
          <FileText className="w-8 h-8 text-danger-tag" />
          <h1 className="text-3xl font-bold text-text-main">Terms of Service</h1>
        </div>
        
        <div className="prose max-w-none text-text-muted space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-text-main mt-8">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the ReWear platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-xl font-semibold text-text-main mt-8">2. User Eligibility</h2>
          <p>
            You must be at least 13 years old to use ReWear. By creating an account, you represent and warrant that you have the right, authority, and capacity to enter into this agreement.
          </p>

          <h2 className="text-xl font-semibold text-text-main mt-8">3. Swapping Rules</h2>
          <p>
            ReWear facilitates the exchange of clothing items between users. All items listed must be clean, accurately described, and in wearable condition. We do not guarantee the quality or authenticity of items swapped between users.
          </p>

          <h2 className="text-xl font-semibold text-text-main mt-8">4. Prohibited Conduct</h2>
          <p>
            Users may not:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>List illegal, counterfeit, or prohibited items</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Create multiple accounts for fraudulent purposes</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>

          <h2 className="text-xl font-semibold text-text-main mt-8">5. Account Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users of ReWear, us, or third parties.
          </p>

          <h2 className="text-xl font-semibold text-text-main mt-8">6. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will notify users of significant changes. Your continued use of the platform after changes constitutes acceptance of the modified Terms.
          </p>
        </div>
      </div>
    </div>
  );
}
