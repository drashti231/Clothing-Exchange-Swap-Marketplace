require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function fix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'drashtivaghela883@gmail.com' });
    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash('123456', salt);
      // bypass the pre-save hook since we manually hashed it just in case
      await User.updateOne({ email: 'drashtivaghela883@gmail.com' }, { $set: { passwordHash: user.passwordHash } });
      console.log("Password reset successfully to 123456");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}
fix();
