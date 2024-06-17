const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');

const mediaRoutes = require('./routes/mediaRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
const upload = multer({ dest: "tmp/" });

// Enable CORS for all routes
app.use(cors());

// APIs
app.use('/api', mediaRoutes);
app.use('/api/user', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});