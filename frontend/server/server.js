const express = require('express');
const cors = require('cors');
const app = express();

const sequelize = require('./config/database');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

app.use(cors()); // 🔥 WAJIB
app.use(express.json());

app.use('/products', productRoutes);
app.use('/auth', authRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected ✅');

    await sequelize.sync();
    console.log('Database synced ✅');

    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  } catch (error) {
    console.error('Database error ❌', error);
  }
})();