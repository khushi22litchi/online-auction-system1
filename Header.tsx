import React, { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import Auth from './Auth';
import CreateAuction from './CreateAuction';
import { getCurrentUser, signOut } from '../lib/storage';

const Header = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateAuction, setShowCreateAuction] = useState(false);
  const [user, setUser] = useState(getCurrentUser());

  const handleSignOut = () => {
    signOut();
    setUser(null);
  };

  return (
    <header className="bg-black shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-pink-500" />
            <h1 className="text-xl font-bold text-white">AuctionHub</h1>
          </div>
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowCreateAuction(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Auction</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white hover:text-pink-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
      {showCreateAuction && <CreateAuction onClose={() => setShowCreateAuction(false)} />}
    </header>
  );
}

export default Header;