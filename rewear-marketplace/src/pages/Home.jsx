import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, ShieldCheck, MapPin, Search, MessageSquare, Repeat } from 'lucide-react';
import ItemCard from '../components/ItemCard';

const Home = () => {
  // Mock data for featured items
  const featuredItems = [
    {
      id: '1',
      title: 'Vintage Denim Jacket',
      brand: "Levi's",
      size: 'M',
      condition: 'Good',
      swapPoints: 450,
      location: 'Surat, Gujarat',
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '2',
      title: 'Floral Summer Dress',
      brand: 'Zara',
      size: 'S',
      condition: 'Like New',
      swapPoints: 420,
      location: 'Ahmedabad, Gujarat',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '3',
      title: 'Oversized Knit Hoodie',
      brand: 'H&M',
      size: 'L',
      condition: 'Excellent',
      swapPoints: 300,
      location: 'Mumbai, MH',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '4',
      title: 'Linen Button-up Shirt',
      brand: 'Uniqlo',
      size: 'M',
      condition: 'New with tags',
      swapPoints: 350,
      location: 'Pune, MH',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <div className="bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <span className="inline-block py-1 px-3 rounded-full bg-[var(--color-lavender)] text-[var(--color-secondary)] font-semibold text-sm mb-6">
                Sustainable Fashion Marketplace
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-[var(--color-primary-dark)] leading-tight mb-6">
                Swap Your Style.<br/>Give Clothes a <span className="text-[var(--color-secondary)]">Second Life.</span>
              </h1>
              <p className="text-lg text-[var(--color-muted)] mb-8 leading-relaxed">
                Exchange clothes you no longer wear with people who will love them. Save money, reduce waste, and refresh your wardrobe sustainably without spending a dime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/marketplace" className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl">
                  Explore Marketplace <ArrowRight size={20} />
                </Link>
                <Link to="/register" className="flex items-center justify-center gap-2 bg-white border-2 border-[var(--color-border-main)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] px-8 py-4 rounded-xl font-semibold text-lg transition-all">
                  List an Item
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-lavender)] to-transparent rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1489987707023-afc7e871f711?auto=format&fit=crop&q=80&w=800" 
                alt="Two people looking happy with sustainable fashion" 
                className="rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              />
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[var(--color-border-main)] flex items-center gap-4 animate-bounce-slow">
                <div className="bg-[var(--color-success)]/10 p-3 rounded-full text-[var(--color-success)]">
                  <Recycle size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">Reduced Waste</p>
                  <p className="text-xl font-extrabold text-[var(--color-text-main)]">12,500 Kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-[var(--color-border-main)] bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-[var(--color-primary)] mb-2">15K+</p>
              <p className="text-sm font-medium text-[var(--color-muted)]">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-[var(--color-secondary)] mb-2">8K+</p>
              <p className="text-sm font-medium text-[var(--color-muted)]">Successful Swaps</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-[var(--color-accent)] mb-2">25K+</p>
              <p className="text-sm font-medium text-[var(--color-muted)]">Items Listed</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-[var(--color-success)] mb-2">12K+</p>
              <p className="text-sm font-medium text-[var(--color-muted)]">Kg Textile Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-[var(--color-text-main)] mb-4">How ReWear Works</h2>
            <p className="text-[var(--color-muted)] text-lg">Four simple steps to refresh your wardrobe sustainably.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <MapPin size={32} />, title: "List Your Clothes", desc: "Upload photos and details of clothes you no longer wear.", step: "01" },
              { icon: <Search size={32} />, title: "Find Your Match", desc: "Browse items in your area and find something you love.", step: "02" },
              { icon: <MessageSquare size={32} />, title: "Send Request", desc: "Offer your item in exchange and chat to negotiate.", step: "03" },
              { icon: <Repeat size={32} />, title: "Exchange & Repeat", desc: "Meet up or ship the items. Enjoy your new look!", step: "04" }
            ].map((feature, idx) => (
              <div key={idx} className="relative bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-border-main)] hover:shadow-md transition-shadow group">
                <div className="text-6xl font-black text-gray-50 absolute top-4 right-4 z-0 transition-colors group-hover:text-[var(--color-lavender)]">
                  {feature.step}
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-[var(--color-lavender)] text-[var(--color-secondary)] rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-3">{feature.title}</h3>
                  <p className="text-[var(--color-muted)] leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-white border-y border-[var(--color-border-main)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-[var(--color-text-main)] mb-2">Featured Finds</h2>
              <p className="text-[var(--color-muted)]">Discover premium pre-loved items ready for a swap.</p>
            </div>
            <Link to="/marketplace" className="hidden sm:flex items-center gap-1 text-[var(--color-secondary)] font-semibold hover:text-[var(--color-primary-dark)] transition-colors">
              View All <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-[var(--color-secondary)] font-semibold border border-[var(--color-secondary)] px-6 py-3 rounded-lg w-full justify-center">
              View All Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Why ReWear */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--color-primary-dark)] rounded-3xl p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-secondary)] rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Your closet has more stories to share.</h2>
              <p className="text-lg text-[#c7bcd4] mb-10 leading-relaxed">
                By participating in the circular fashion economy, you're not just saving money—you're actively reducing water consumption, carbon emissions, and landfill waste.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg text-[var(--color-accent)]"><ShieldCheck size={24} /></div>
                  <span className="font-semibold text-lg">Trusted Community</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg text-[var(--color-success)]"><Recycle size={24} /></div>
                  <span className="font-semibold text-lg">Eco-Friendly</span>
                </div>
              </div>
              <Link to="/register" className="inline-block bg-[var(--color-accent)] hover:bg-[#ff7a50] text-[var(--color-primary-dark)] font-bold px-8 py-4 rounded-xl text-lg transition-transform transform hover:scale-105">
                Start Swapping Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
