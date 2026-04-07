const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const debugUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/police-complaints');
        const users = await User.find({});
        console.log("TOTAL USERS:", users.length);
        users.forEach(u => {
            console.log(`- ${u.email} | Role: ${u.role} | ID: ${u._id}`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

debugUser();
