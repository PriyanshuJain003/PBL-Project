import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import paymentRouter from './routes/paymentRouter.mjs';
import loginRouter from './routes/loginRouter.mjs';
import { startPacketCapture } from './middleware/packetAnalyzer.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

// API routes
app.use('/loginApi', loginRouter);
app.use('/payApi', paymentRouter);

// Serve the main HTML file for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
    startPacketCapture();
});