import React from 'react';
import { Toaster } from 'react-hot-toast';
import ProductList from './components/ProductList';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-right" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProductList />
      </main>
    </div>
  );
}

export default App;