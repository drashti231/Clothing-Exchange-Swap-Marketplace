import React from 'react';
import { Leaf, Users, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="bg-bg-main min-h-screen font-sans text-text-main pb-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-brand-light w-full rounded-b-[40px] pt-16 pb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4 leading-tight">
            Fashion that doesn't cost the Earth.
          </h1>
          <p className="text-base md:text-lg text-text-muted mb-8 max-w-2xl mx-auto">
            ReWear is a community-driven clothing exchange platform built to give your pre-loved garments a second life. No money, just pure swapping.
          </p>
        </div>
        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 animate-scale-in delay-200">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-primary/20 rounded-2xl transform rotate-3 -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800"
                alt="Sustainable Fashion"
                className="rounded-2xl shadow-xl w-full object-cover h-[350px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
          <div className="md:w-1/2 space-y-4 animate-fade-in-up delay-300">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark relative inline-block">
              Our Mission
              <div className="absolute -bottom-2 left-0 w-10 h-1 bg-brand-primary rounded-full"></div>
            </h2>
            <p className="text-text-muted text-base leading-relaxed mt-4">
              Fast fashion has led to overflowing landfills and massive environmental degradation. We believe in a circular economy where clothes are cherished, shared, and worn repeatedly.
            </p>
            <p className="text-text-muted text-base leading-relaxed">
              By swapping instead of buying, you are directly reducing your carbon footprint and saving water, all while refreshing your wardrobe for free.
            </p>
            <Link to="/marketplace" className="inline-block bg-brand-dark text-white px-6 py-3 rounded-md font-semibold text-base hover:bg-brand-primary transition-all hover:-translate-y-1 shadow-md mt-4">
              Start Swapping
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-12 animate-fade-in-up delay-100">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3">Our Core Values</h2>
          <p className="text-text-muted text-base max-w-2xl mx-auto">The principles that guide our community and platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Leaf className="w-6 h-6 text-brand-primary" />, title: "Sustainability", desc: "Prioritizing the planet over profits by keeping clothes in circulation." },
            { icon: <Users className="w-6 h-6 text-brand-primary" />, title: "Community", desc: "Building a trusted network of fashion lovers who care about the environment." },
            { icon: <ShieldCheck className="w-6 h-6 text-brand-primary" />, title: "Trust & Safety", desc: "Ensuring every swap is secure, transparent, and fair for both parties." },
            { icon: <Heart className="w-6 h-6 text-brand-primary" />, title: "Generosity", desc: "Giving pre-loved items a new home and embracing a sharing mindset." }
          ].map((value, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-border-subtle hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: `${idx * 150 + 200}ms` }}>
              <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                {React.cloneElement(value.icon, { className: "w-6 h-6 group-hover:text-white transition-colors" })}
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">{value.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
