const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Import database connection
require("./config/db");

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

//Routes
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

//Test route
app.get('/', (req, res) => {
    res.send('Backend server is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});