import React from 'react';
import { Shield, Lock, UserCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TrustSafety() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <Shield className="w-16 h-16 text-brand-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Trust & Safety</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your safety and the security of your swaps are our top priorities. 
          Here is how we maintain a trusted community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-start">
          <UserCheck className="w-10 h-10 text-danger-tag mb-4" />
          <h3 className="text-xl font-bold text-text-main mb-2">Verified Users</h3>
          <p className="text-gray-600">
            We encourage all members to complete their profiles. Look for users with established swap histories and positive reviews to ensure a reliable experience.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-start">
          <Lock className="w-10 h-10 text-brand-primary mb-4" />
          <h3 className="text-xl font-bold text-text-main mb-2">Secure Messaging</h3>
          <p className="text-gray-600">
            Keep all communication on the ReWear platform. Our integrated chat protects your privacy and provides a record of your agreements in case of disputes.
          </p>
        </div>
      </div>

      <div className="bg-warm-cream p-8 rounded-2xl mb-12">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">How to Stay Safe</h2>
        <ul className="space-y-4 text-gray-700 list-disc pl-5">
          <li><strong>Review Profiles:</strong> Before agreeing to a swap, check the other user's ratings and past feedback.</li>
          <li><strong>Track Your Shipments:</strong> Always use a shipping method that provides a tracking number and share it with your swap partner.</li>
          <li><strong>Protect Personal Info:</strong> Never share your financial information, social security number, or unnecessary personal details in chat.</li>
          <li><strong>Document Everything:</strong> Take clear photos of your items before shipping and the package you receive before opening it.</li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between bg-brand-dark text-white p-8 rounded-2xl">
        <div className="mb-6 md:mb-0 md:mr-8">
          <div className="flex items-center space-x-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-danger-tag" />
            <h3 className="text-xl font-bold">Report an Issue</h3>
          </div>
          <p className="text-brand-light text-sm">
            If you encounter suspicious behavior, a user violating guidelines, or have an issue with a swap, please let our team know immediately.
          </p>
        </div>
        <Link to="/contact-us" className="whitespace-nowrap bg-danger-tag px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
