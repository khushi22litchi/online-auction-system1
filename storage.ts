import { Product, User, Bid } from '../types';

// Local storage keys
const USERS_KEY = 'auction_users';
const PRODUCTS_KEY = 'auction_products';
const BIDS_KEY = 'auction_bids';
const CURRENT_USER_KEY = 'auction_current_user';

// Helper functions
const getItem = <T>(key: string): T[] => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// User management
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const signUp = (email: string, password: string): User => {
  const users = getItem<User>(USERS_KEY);
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    role: 'buyer'
  };

  users.push(newUser);
  setItem(USERS_KEY, users);
  setCurrentUser(newUser);
  return newUser;
};

export const signIn = (email: string): User => {
  const users = getItem<User>(USERS_KEY);
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('User not found');
  }

  setCurrentUser(user);
  return user;
};

export const signOut = () => {
  setCurrentUser(null);
};

// Product management
export const getProducts = (): Product[] => {
  return getItem<Product>(PRODUCTS_KEY);
};

export const createProduct = (product: Omit<Product, 'id'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID()
  };

  products.push(newProduct);
  setItem(PRODUCTS_KEY, products);
  return newProduct;
};

// Bid management
export const getBids = (): Bid[] => {
  return getItem<Bid>(BIDS_KEY);
};

export const createBid = (bid: Omit<Bid, 'id' | 'bid_time'>): Bid => {
  const bids = getBids();
  const newBid: Bid = {
    ...bid,
    id: crypto.randomUUID(),
    bid_time: new Date().toISOString()
  };

  bids.push(newBid);
  setItem(BIDS_KEY, bids);

  // Update product's current price
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === bid.product_id);
  if (productIndex !== -1) {
    products[productIndex].price = bid.amount;
    setItem(PRODUCTS_KEY, products);
  }

  return newBid;
};