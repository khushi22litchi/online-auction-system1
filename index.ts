export interface User {
  id: string;
  email: string;
  role: 'seller' | 'buyer';
  phone?: string;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  bid_end: string;
  image_url: string;
}

export interface Bid {
  id: string;
  product_id: string;
  buyer_id: string;
  amount: number;
  bid_time: string;
}