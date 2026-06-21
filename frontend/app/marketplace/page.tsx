'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiHeart } from 'react-icons/fi';

export default function Marketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products', {
        params: { search, take: 20 },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-card/50 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Marketplace</h1>
            <Link href="/auth/login" className="text-accent hover:text-accent-secondary">
              Sign In
            </Link>
          </div>
          
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-dark-card/50 border border-gray-800 rounded-lg overflow-hidden hover:border-accent transition">
                <div className="h-40 bg-dark-bg/50 flex items-center justify-center text-gray-400">
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    '📦'
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate">{product.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{product.store?.storeName}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-accent font-bold">${product.price}</div>
                    <button className="text-gray-400 hover:text-accent transition">
                      <FiHeart />
                    </button>
                  </div>
                  <button className="w-full mt-3 py-2 bg-accent text-dark-bg rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-accent/50 transition flex items-center justify-center gap-2">
                    <FiShoppingCart /> Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
