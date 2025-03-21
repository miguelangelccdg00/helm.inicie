import express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

app.use(json());

// Define routes here
// Example: app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`API Auth Helm is running on http://localhost:${PORT}`);
});