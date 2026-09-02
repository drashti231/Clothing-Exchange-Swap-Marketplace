import React from 'react';
import { Camera, RefreshCw, Shirt, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Camera className="w-8 h-8 text-danger-tag" />,
      title: "1. List Your Items",
      desc: "Snap a few clear photos of clothes you no longer wear. Describe them honestly, noting any wear and tear. Set a fair value."
    },
    {
      icon: <Search className="w-8 h-8 text-brand-primary" />,
      title: "2. Explore the Marketplace",
      desc: "Browse our community's diverse closet. Use filters to find your style, size, and preferred brands. Find something you love!"
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-danger-tag" />,
      title: "3. Propose a Swap",
      desc: "Found a match? Send a swap request! You can offer one or multiple items from your closet in exchange."
    },
    {
      icon: <Shirt className="w-8 h-8 text-brand-primary" />,
      title: "4. Agree and Ship",
      desc: "Chat with the owner to iron out details. Once you both agree, pack your items securely and ship them out."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-danger-tag" />,
      title: "5. Enjoy Your New Look",
      desc: "Receive your new-to-you clothes, confirm the swap was successful, and leave a friendly review for your swap partner."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">How ReWear Works</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join the circular fashion movement. Swapping is easy, fun, and sustainable. 
          Here's how you can refresh your wardrobe in five simple steps.
        </p>
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-warm-cream shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {step.icon}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-bold text-xl text-text-main mb-2">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-20 text-center bg-warm-cream p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">Ready to start swapping?</h2>
        <Link to="/list-item" className="inline-block bg-danger-tag text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-700 transition shadow-sm">
          List Your First Item
        </Link>
      </div>
    </div>
  );
}
