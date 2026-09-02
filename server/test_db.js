require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    const user = await User.findOne({ email: 'drashtivaghela883@gmail.com' });
    if (user) {
      console.log("User found:", user.email);
    } else {
      console.log("User not found");
    }
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    mongoose.connection.close();
  }
}
test();
