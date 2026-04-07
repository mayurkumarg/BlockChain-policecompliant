const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['CITIZEN', 'POLICE', 'ADMIN'], default: 'CITIZEN' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  
  const allUsers = await User.find({});
  console.log('Total users:', allUsers.length);
  allUsers.forEach(u => {
    console.log('  email:', u.email, '| role:', u.role, '| _id:', u._id.toString());
  });

  // Force-fix or create admin
  const hashed = await bcrypt.hash('adminpassword123', 10);
  const result = await User.findOneAndUpdate(
    { email: 'admin@police.gov' },
    { name: 'System Admin', email: 'admin@police.gov', password: hashed, role: 'ADMIN' },
    { upsert: true, new: true }
  );
  console.log('\nADMIN UPSERTED:', result.email, '| role:', result.role, '| _id:', result._id.toString());

  await mongoose.disconnect();
};

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
