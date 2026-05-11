const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('Auto Consult API is running!');
});

// Import and use routes
app.use('/api/cars', require('./routes/cars'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/documents', require('./routes/documents'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
