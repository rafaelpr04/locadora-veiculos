require('dotenv').config();
const app = require('./app');

if (!process.env.JWT_SECRET) {
  console.error('Defina JWT_SECRET no arquivo .env');
  process.exit(1);
}

const porta = process.env.PORT || 3333;
app.listen(porta, () => console.log(`API em http://localhost:${porta}`));
