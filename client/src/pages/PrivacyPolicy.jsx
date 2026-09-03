import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-brand-primary/10">
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-100">
          <Shield className="w-8 h-8 text-danger-tag" />
          <h1 className="text-3xl font-bold text-text-main">Privacy Policy</h1>
        </div>
        
        <div className="prose max-w-none text-text-muted space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-text-main mt-8">1. Information We Collect</h2>
          <p>
            When you register for a ReWear account, we collect personal information such as your name, email address, and profile picture. We also collect information about the items you list, your swaps, and your interactions with other users.
          </p>

          <h2 className="text-xl font-semibold text-text-main mt-8">2. How We Use Your Information</h2>
          <p>
            We use your information to provide and improve our services, facilitate swaps between users, ensure platform safety, and communicate with you about your account and our services.
          </p>

          <h2 className="text-xl font-semibold text-text-main mt-8">3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share necessary information with other users to facilitate a swap (such as your approximate location or profile details). We also share information with service providers who help us operate our platform.
          </p>

          <h2 className="text-xl font-semibold text-text-main mt-8">4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-semibold text-text-main mt-8">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You can manage your account settings or contact us to exercise these rights.
          </p>

          <h2 className="text-xl font-semibold text-text-main mt-8">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@rewear.com.
          </p>
        </div>
      </div>
    </div>
  );
}
