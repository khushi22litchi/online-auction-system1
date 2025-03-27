import React, { useEffect, useState } from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { getProducts, getCurrentUser, createBid } from '../lib/storage';
import toast from 'react-hot-toast';
import { Product } from '../types';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bidAmount, setBidAmount] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const placeBid = async (productId: string, currentPrice: number) => {
    try {
      const amount = parseFloat(bidAmount[productId]);
      if (isNaN(amount) || amount <= currentPrice) {
        throw new Error('Bid must be higher than current price');
      }

      const user = getCurrentUser();
      if (!user) throw new Error('Please sign in to place a bid');

      createBid({
        product_id: productId,
        buyer_id: user.id,
        amount: amount
      });

      toast.success('Bid placed successfully!');
      setBidAmount({ ...bidAmount, [productId]: '' });
      setProducts(getProducts());
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Active Auctions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-black rounded-lg shadow-xl overflow-hidden border border-pink-500">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-300">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-pink-500">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">{product.price}</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(product.bid_end).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <input
                  type="number"
                  value={bidAmount[product.id] || ''}
                  onChange={(e) => setBidAmount({ ...bidAmount, [product.id]: e.target.value })}
                  placeholder="Enter bid amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-pink-500 focus:ring focus:ring-pink-200"
                  min={product.price + 1}
                  step="0.01"
                />
                <button
                  onClick={() => placeBid(product.id, product.price)}
                  className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  Place Bid
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;