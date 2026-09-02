require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const ClothingItem = require('./models/ClothingItem');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rewear';

const users = [
  {
    name: 'Alice Admin',
    email: 'admin@rewear.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'admin',
    rating: 5,
    location: { type: 'Point', coordinates: [-74.006, 40.7128] } // NYC
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'user',
    rating: 4.8,
    location: { type: 'Point', coordinates: [-73.935242, 40.730610] } // NYC
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'user',
    rating: 4.5,
    location: { type: 'Point', coordinates: [-118.243683, 34.052235] } // LA
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await User.deleteMany();
    await ClothingItem.deleteMany();

    const createdUsers = await User.insertMany(users);
    
    const adminUser = createdUsers[0];
    const janeUser = createdUsers[1];
    const johnUser = createdUsers[2];

    const items = [
      {
        owner: janeUser._id,
        title: 'Vintage Denim Jacket',
        description: 'Authentic 90s Levi\'s jacket. Great condition, slight fade.',
        category: 'Jacket',
        clothingType: 'Tops',
        color: 'Blue',
        size: 'M',
        brand: 'Levi\'s',
        condition: 'Good',
        images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800'],
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        location: { type: 'Point', coordinates: [-73.935242, 40.730610] },
        estimatedSwapPoints: 45
      },
      {
        owner: janeUser._id,
        title: 'Floral Summer Dress',
        description: 'Light and breezy maxi dress. Worn twice.',
        category: 'Dress',
        clothingType: 'Dresses',
        color: 'Multi',
        size: 'S',
        brand: 'Zara',
        condition: 'Like new',
        images: ['https://images.unsplash.com/photo-1572804013309-82a89b47afc2?w=800'],
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        location: { type: 'Point', coordinates: [-73.935242, 40.730610] },
        estimatedSwapPoints: 30
      },
      {
        owner: johnUser._id,
        title: 'Nike Air Max Sneakers',
        description: 'Barely worn, comes with original box.',
        category: 'Footwear',
        clothingType: 'Shoes',
        color: 'White',
        size: '10',
        brand: 'Nike',
        condition: 'Like new',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        location: { type: 'Point', coordinates: [-118.243683, 34.052235] },
        estimatedSwapPoints: 80
      },
      {
        owner: johnUser._id,
        title: 'Graphic Print T-Shirt',
        description: 'Cool graphic tee. 100% cotton.',
        category: 'T-Shirt',
        clothingType: 'Tops',
        color: 'Black',
        size: 'L',
        brand: 'Uniqlo',
        condition: 'New with tags',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        location: { type: 'Point', coordinates: [-118.243683, 34.052235] },
        estimatedSwapPoints: 20
      }
    ];

    await ClothingItem.insertMany(items);

    console.log('Data successfully seeded!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedData();
});
