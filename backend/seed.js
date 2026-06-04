const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Game = require('./models/Game');
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gamestore';

const games = [
  {
    title: 'Grand Theft Auto V',
    description:
      'An action-adventure game set in the fictional state of San Andreas. Experience three unique criminals and the risks they take to survive in a city obsessed with wealth and self-improvement.',
    price: 29.99,
    category: 'Action',
    images: [
      'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png',
    ],
    rating: 4.8,
    numReviews: 1200,
  },
  {
    title: 'FIFA 24',
    description:
      'Experience the beautiful game with HyperMotionV technology and real-world data from over 300 competitions. Play as your favorite clubs and national teams.',
    price: 59.99,
    category: 'Sports',
    images: [
      'https://upload.wikimedia.org/wikipedia/en/7/76/FIFA_24_cover.jpg',
    ],
    rating: 4.2,
    numReviews: 850,
  },
  {
    title: 'Red Dead Redemption 2',
    description:
      'America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run. Experience an epic tale of life in America at the dawn of the modern age.',
    price: 39.99,
    category: 'Open World',
    images: [
      'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg',
    ],
    rating: 4.9,
    numReviews: 980,
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    description:
      'A story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences. Hunt monsters, craft weapons, and forge alliances.',
    price: 19.99,
    category: 'RPG',
    images: [
      'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg',
    ],
    rating: 4.9,
    numReviews: 1450,
  },
  {
    title: 'Call of Duty: Modern Warfare III',
    description:
      'Task Force 141 must stop Makarov from plunging the world into chaos. Experience the most immersive COD campaign to date plus iconic multiplayer modes.',
    price: 69.99,
    category: 'Shooter',
    images: [
      'https://upload.wikimedia.org/wikipedia/en/3/31/Call_of_Duty_Modern_Warfare_III_cover.jpg',
    ],
    rating: 4.0,
    numReviews: 760,
  },
  {
    title: 'Minecraft',
    description:
      'Explore infinite worlds and build everything from the simplest of homes to the grandest of castles. Play in creative mode or survival mode — the choice is yours.',
    price: 26.99,
    category: 'Sandbox',
    images: [
      'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png',
    ],
    rating: 4.7,
    numReviews: 2100,
  },
  {
    title: 'Elden Ring',
    description:
      'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. A massive open world action RPG.',
    price: 59.99,
    category: 'RPG',
    images: [
      'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg',
    ],
    rating: 4.9,
    numReviews: 1100,
  },
  {
    title: 'Cyberpunk 2077',
    description:
      'An open-world action-adventure story set in Night City, a megalopolis obsessed with power, glamour, and body modification. Play as V, a mercenary outlaw going after a one-of-a-kind implant.',
    price: 39.99,
    category: 'RPG',
    images: [
      'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
    ],
    rating: 4.5,
    numReviews: 1320,
  },
  {
    title: 'Fortnite',
    description:
      'Drop in, squad up, and compete to be the last one standing. Fortnite is the ever-evolving battle royale game with constantly fresh seasons, collaborations, and events.',
    price: 0,
    category: 'Battle Royale',
    images: [
      'https://upload.wikimedia.org/wikipedia/en/9/93/Fortnite-coverart.jpg',
    ],
    rating: 4.1,
    numReviews: 3000,
  },
  {
    title: "Assassin's Creed Mirage",
    description:
      "Return to the origins of the Assassin's Creed saga. Explore the bustling streets of ninth-century Baghdad as Basim Ibn Ishaq, a young thief seeking answers to the mysteries of his dark visions.",
    price: 49.99,
    category: 'Action',
    images: [
      'https://upload.wikimedia.org/wikipedia/en/a/af/Assassin%27s_Creed_Mirage_cover_art.jpg',
    ],
    rating: 4.3,
    numReviews: 620,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Game.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');

    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@gamestore.com',
      password: adminPassword,
      role: 'admin',
    });
    // bypass pre-save hook for already-hashed password
    await User.updateOne({ _id: admin._id }, { password: adminPassword });
    console.log('Admin created: admin@gamestore.com / admin123');

    // Create regular demo user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'Demo User',
      email: 'user@gamestore.com',
      password: userPassword,
    });
    await User.updateOne(
      { email: 'user@gamestore.com' },
      { password: userPassword }
    );
    console.log('Demo user created: user@gamestore.com / user123');

    // Seed games
    await Game.insertMany(games);
    console.log(`${games.length} games seeded`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message, err);
    process.exit(1);
  }
};

seedDB();
