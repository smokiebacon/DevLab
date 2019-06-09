const express = require('express');
const connectDB = require('./config/db');
const app = express();
//connect db
connectDB();

app.get('/', (req, res) => res.send('API Working'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
