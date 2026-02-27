const express = require('express');
const app = express();

const sequelize = require('./config/database');
const productRoutes = require('./routes/products');

app.use(express.json());
app.use('/products', productRoutes);

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