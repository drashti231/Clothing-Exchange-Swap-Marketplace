import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, RefreshCw, MapPin, UploadCloud, Search, Heart, ShieldCheck, Leaf, UsersRound, Ban } from 'lucide-react';

export default function Home() {
  const categories = [
    { name: "Tops", image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=500" },
    { name: "Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=500" },
    { name: "Jeans", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=500" },
    { name: "Jackets", image: "https://images.unsplash.com/photo-1551028719-0c1efc40599a?auto=format&fit=crop&q=80&w=500" },
    { name: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=500" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=500" }
  ];

  return (
    <div className="flex flex-col bg-bg-main min-h-screen font-sans text-text-main pb-16 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-brand-light w-full rounded-b-[40px] sm:rounded-b-[50px] pt-16 pb-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between overflow-visible">
          <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left z-10">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-brand-dark mb-4 leading-tight animate-fade-in-up">
            Swap Clothes.<br/>
            Refresh Your Wardrobe.<br/>
            <span className="text-brand-primary">Reduce Waste.</span>
          </h1>
          <p className="mt-4 text-base text-text-muted max-w-xl mx-auto lg:mx-0 mb-8 font-medium animate-fade-in-up delay-100">
            Join a community that believes in sustainable fashion and conscious living.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-200">
            <Link to="/marketplace" className="bg-brand-dark text-white px-6 py-3 rounded-md font-semibold text-base hover:bg-brand-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              Explore Clothes
            </Link>
            <Link to="/list-item" className="bg-white text-brand-dark border border-border-subtle px-6 py-3 rounded-md font-semibold text-base hover:bg-bg-main hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              List an Item
            </Link>
          </div>
        </div>
        
        <div className="lg:w-1/2 mt-12 lg:mt-0 relative z-10 hidden md:block animate-scale-in delay-300">
          <div className="relative w-full max-w-md mx-auto animate-float">
             {/* Decorative Background Blob behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/50 rounded-full blur-3xl -z-10"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800" 
              alt="Clothing Rack" 
              className="rounded-2xl shadow-2xl w-full object-cover h-[380px] transform transition-transform hover:scale-105 duration-700"
            />
            
            {/* Floating Tag */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-border-subtle flex items-center animate-fade-in-up delay-500 hover:-translate-y-2 transition-transform duration-300">
               <Heart className="w-8 h-8 text-danger-tag mr-3 fill-danger-tag/20" />
               <div>
                 <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Loved Item</p>
                 <p className="font-bold text-brand-dark">Denim Jacket <span className="text-danger-tag ml-1">450 pts</span></p>
               </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 animate-fade-in-up delay-400">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-500 py-6 px-6 flex flex-wrap justify-between items-center text-center gap-4 border border-border-subtle group">
          <div className="flex flex-col items-center flex-1 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center text-brand-primary mb-1">
              <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold">15K+</h3>
            </div>
            <p className="text-text-muted text-sm font-medium">Happy Users</p>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-border-subtle"></div>
          
          <div className="flex flex-col items-center flex-1 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center text-brand-primary mb-1">
              <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold">25K+</h3>
            </div>
            <p className="text-text-muted text-sm font-medium">Items Listed</p>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-border-subtle"></div>

          <div className="flex flex-col items-center flex-1 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center text-brand-primary mb-1">
              <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-700" />
              <h3 className="text-2xl font-bold">8K+</h3>
            </div>
            <p className="text-text-muted text-sm font-medium">Successful Swaps</p>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-border-subtle"></div>

          <div className="flex flex-col items-center flex-1 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center text-brand-primary mb-1">
              <MapPin className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300 group-hover:-translate-y-1" />
              <h3 className="text-2xl font-bold">50+</h3>
            </div>
            <p className="text-text-muted text-sm font-medium">Cities Covered</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3 relative inline-block">
            How ReWear Works
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-brand-primary rounded-full"></div>
          </h2>
          <p className="text-text-muted text-base mt-4">See how easy it is to swap and save the planet.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center group animate-fade-in-up delay-100 cursor-pointer">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 text-brand-primary group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
              <UploadCloud className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-1">1. List Your Item</h3>
            <p className="text-text-muted text-sm px-4">Upload clothes you no longer use.</p>
          </div>
          
          <div className="flex flex-col items-center text-center group animate-fade-in-up delay-200 cursor-pointer">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 text-brand-primary group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
              <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-1">2. Find & Connect</h3>
            <p className="text-text-muted text-sm px-4">Discover items you love and connect.</p>
          </div>
          
          <div className="flex flex-col items-center text-center group animate-fade-in-up delay-300 cursor-pointer">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 text-brand-primary group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
              <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-1">3. Swap & Confirm</h3>
            <p className="text-text-muted text-sm px-4">Agree on the swap and exchange.</p>
          </div>
          
          <div className="flex flex-col items-center text-center group animate-fade-in-up delay-400 cursor-pointer">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 text-brand-primary group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
              <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-1">4. Give Fashion A Second Life</h3>
            <p className="text-text-muted text-sm px-4">Help reduce waste.</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-20 animate-fade-in-up delay-200">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Popular Categories</h2>
          <Link to="/marketplace" className="text-brand-primary font-semibold hover:underline text-sm flex items-center group">
            Explore all 
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/marketplace?category=${cat.name}`} 
              className="relative h-40 sm:h-52 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <img 
                src={cat.image} 
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between items-end">
                <span className="text-white font-bold text-base tracking-wide group-hover:-translate-y-1 transition-transform duration-300">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Features */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-border-subtle animate-fade-in-up delay-300">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 text-xs sm:text-sm text-text-muted font-medium">
          <div className="flex items-center hover:text-brand-primary transition-colors cursor-default">
            <Leaf className="w-4 h-4 mr-2 text-brand-primary animate-pulse" />
            Sustainable Fashion
          </div>
          <div className="flex items-center hover:text-brand-primary transition-colors cursor-default">
            <UsersRound className="w-4 h-4 mr-2 text-brand-primary" />
            Community Driven
          </div>
          <div className="flex items-center hover:text-brand-primary transition-colors cursor-default">
            <Ban className="w-4 h-4 mr-2 text-brand-primary" />
            No Money, Just Swap
          </div>
          <div className="flex items-center hover:text-brand-primary transition-colors cursor-default">
            <ShieldCheck className="w-4 h-4 mr-2 text-brand-primary" />
            Trusted & Safe
          </div>
        </div>
      </section>

    </div>
  );
}