const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user-routes');
const jobRoutes = require('./routes/job-routes');
const applicationRoutes = require('./routes/application-routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => {
  res.send('Edu-Work API Running');
});

module.exports = app;