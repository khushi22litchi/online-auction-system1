/*
  # Create initial schema for auction system

  1. Tables
    - products
      - id (uuid, primary key)
      - seller_id (uuid, references auth.users)
      - name (text)
      - description (text)
      - current_bid (numeric)
      - starting_price (numeric)
      - end_time (timestamptz)
      - image_url (text)
      - created_at (timestamptz)
    
    - bids
      - id (uuid, primary key)
      - product_id (uuid, references products)
      - bidder_id (uuid, references auth.users)
      - amount (numeric)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  current_bid numeric DEFAULT 0,
  starting_price numeric NOT NULL,
  end_time timestamptz NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create bids table
CREATE TABLE bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products NOT NULL,
  bidder_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Users can create products" ON products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their products" ON products
  FOR UPDATE USING (auth.uid() = seller_id);

-- Policies for bids
CREATE POLICY "Anyone can view bids" ON bids
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can place bids" ON bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);