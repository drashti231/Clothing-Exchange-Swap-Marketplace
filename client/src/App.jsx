import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Auth from './pages/Auth'
import ItemDetail from './pages/ItemDetail'
import ListItem from './pages/ListItem'
import Swaps from './pages/Swaps'
import Chat from './pages/Chat'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Community from './pages/Community'
import GroupDetail from './pages/GroupDetail'
import HowItWorks from './pages/HowItWorks'
import SwapGuidelines from './pages/SwapGuidelines'
import TrustSafety from './pages/TrustSafety'
import FAQ from './pages/FAQ'
import ContactUs from './pages/ContactUs'
import AboutUs from './pages/AboutUs'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/list-item" element={<ListItem />} />
            <Route path="/items/:id/edit" element={<ListItem />} />
            <Route path="/swaps" element={<Swaps />} />
            <Route path="/chat/:swapId" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:id" element={<GroupDetail />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/swap-guidelines" element={<SwapGuidelines />} />
            <Route path="/trust-safety" element={<TrustSafety />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
