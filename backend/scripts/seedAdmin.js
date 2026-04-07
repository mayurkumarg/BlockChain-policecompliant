const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const fs = require('fs');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/police-complaints');

    const adminExists = await User.findOne({ email: 'admin@police.gov' });

    if (adminExists) {
      fs.writeFileSync('seed_error.txt', 'Admin user already exists\n');
      process.exit(0);
    }

    const admin = new User({
      name: 'System Admin',
      email: 'admin@police.gov',
      password: 'adminpassword123',
      role: 'ADMIN',
    });
    await admin.save();

    fs.writeFileSync('seed_error.txt', `Admin created with ID: ${admin._id}\n`);
    process.exit(0);
  } catch (error) {
    fs.writeFileSync('seed_error.txt', `SEED SCRIPT ERROR: ${error.message}\n${error.stack}\n`);
    process.exit(1);
  }
};

seedAdmin();
