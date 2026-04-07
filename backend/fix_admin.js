const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  // Check admin user
  const admin = await User.findOne({ email: 'admin@police.gov' });
  if (!admin) {
    console.log('ADMIN NOT FOUND - creating...');
    await User.create({ name: 'System Admin', email: 'admin@police.gov', password: 'adminpassword123', role: 'ADMIN' });
    console.log('ADMIN CREATED');
  } else {
    console.log(`ADMIN FOUND: _id=${admin._id} role=${admin.role}`);
    // Force the role to ADMIN in case it was corrupted
    if (admin.role !== 'ADMIN') {
      await User.findByIdAndUpdate(admin._id, { role: 'ADMIN' });
      console.log('ROLE FIXED TO ADMIN');
    } else {
      console.log('ROLE IS ALREADY ADMIN - OK');
    }
  }

  // List all users
  const allUsers = await User.find({});
  console.log(`\nALL USERS (${allUsers.length}):`);
  allUsers.forEach(u => console.log(`  - ${u.email} | role: ${u.role} | _id: ${u._id}`));

  mongoose.disconnect();
}).catch(err => { console.error('DB ERROR:', err.message); process.exit(1); });
