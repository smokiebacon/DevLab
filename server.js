const express = require('express');
var cors = require('cors')

const connectDB = require('./config/db');

const auth = require('./routes/api/auth')
const profiles = require('./routes/api/profiles')
const posts = require('./routes/api/posts')
const users = require('./routes/api/users')
const app = express();
//connect db
connectDB();

//init middleware
//bodyParser
app.use(express.json({ extended: false }));
app.use(cors())


app.get('/', (req, res) => res.send('API Working'));

//Define Routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
