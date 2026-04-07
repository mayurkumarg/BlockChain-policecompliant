const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const checkAdmin = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/police-complaints');
    const admin = await User.findOne({ email: 'admin@police.gov' });
    console.log("Admin exists?", !!admin);
    if (admin) {
        console.log("Admin password hash:", admin.password);
        const isMatch = await admin.matchPassword('adminpassword123');
        console.log("Password match for adminpassword123:", isMatch);
        console.log("User role:", admin.role);
    }
    process.exit(0);
};

checkAdmin();
