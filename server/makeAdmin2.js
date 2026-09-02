const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/clothing-exchange')
  .then(async () => {
    const db = mongoose.connection.db;
    const result = await db.collection('users').updateOne(
      { email: 'drashtivaghela2311@gmail.com' },
      { $set: { role: 'admin' } }
    );
    console.log('Update Result:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
