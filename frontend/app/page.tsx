import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiShoppingCart, FiUsers, FiTrendingUp } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-secondary rounded-lg flex items-center justify-center font-bold text-dark-bg">
              DB
            </div>
            <h1 className="text-2xl font-bold">Dark Blade</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-4 py-2 text-accent hover:text-accent-secondary transition">
              Login
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-gradient-to-r from-accent to-accent-secondary text-dark-bg rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/50 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent via-accent-secondary to-accent bg-clip-text text-transparent">
            Premium Marketplace<br />Bitcoin-Powered
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Build your store, grow your business. Bitcoin-only payments, end-to-end encrypted chat, and enterprise-grade security.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/marketplace" className="px-8 py-3 bg-accent text-dark-bg rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/50 transition flex items-center gap-2">
              Browse Marketplace <FiArrowRight />
            </Link>
            <Link href="/auth/register?role=seller" className="px-8 py-3 border border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition">
              Become a Seller
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-t border-gray-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">10,000+</div>
            <div className="text-gray-400">Active Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">5,000+</div>
            <div className="text-gray-400">Verified Sellers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">$50M+</div>
            <div className="text-gray-400">Transactions Processed</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-dark-card/30 border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Why Dark Blade?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiShoppingCart, title: 'Bitcoin Only', desc: 'Secure blockchain payments' },
              { icon: FiUsers, title: 'Independent Stores', desc: 'Every seller has their own storefront' },
              { icon: FiTrendingUp, title: 'Growth Tools', desc: 'Analytics and insights' },
              { icon: FiArrowRight, title: 'Fast Checkout', desc: 'One-click purchases' },
            ].map((feature, i) => (
              <div key={i} className="bg-dark-bg/50 border border-gray-800 rounded-lg p-6 hover:border-accent transition">
                <feature.icon className="text-accent text-3xl mb-4" />
                <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to start selling?</h3>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Join thousands of sellers earning with Dark Blade. $50/month subscription gets you your own store.
        </p>
        <Link href="/auth/register?role=seller" className="inline-block px-8 py-3 bg-gradient-to-r from-accent to-accent-secondary text-dark-bg rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/50 transition">
          Start Selling Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/marketplace">Marketplace</Link></li>
                <li><Link href="/sellers">Sellers</Link></li>
                <li><Link href="/about">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/cookies">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Security</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>🔒 End-to-end Encrypted</li>
                <li>✅ Bitcoin-powered</li>
                <li>🛡️ Enterprise Grade</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Dark Blade. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
