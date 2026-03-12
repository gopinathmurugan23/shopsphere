require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'Stealth Audio X1',
    description: 'Premium noise-cancelling headphones with obsidian finish and 40h battery life.',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    category: 'Audio',
    stock: 15
  },
  {
    name: 'Vortex Smart Watch',
    description: 'Next-gen health tracking with sapphire glass and titanium casing.',
    price: 15999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    category: 'Wearables',
    stock: 20
  },
  {
    name: 'Lumina Desk Lamp',
    description: 'Minimalist lighting with touch controls and adjustable color temperature.',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=1000&auto=format&fit=crop',
    category: 'Home',
    stock: 5
  },
  {
    name: 'Neo Mechanical Keyboard',
    description: 'Compact 65% design with hot-swappable switches and RGB lighting.',
    price: 12499,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop',
    category: 'Computing',
    stock: 12
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
    
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Insert Products
    await Product.insertMany(products);
    console.log('Products Seeded!');

    // Insert Admin User
    await User.create({
      name: 'Gopinath',
      email: 'gopinath@shopsphere.com',
      password: 'Gopidev@23',
      role: 'admin'
    });
    console.log('Admin User Seeded!');
    
    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
