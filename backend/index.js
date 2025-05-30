const express = require('express');
const cors = require('cors');
const metadataRoutes = require('./routes/metadata');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', metadataRoutes);

app.listen(3001, () => console.log('Backend running on port 3001'));