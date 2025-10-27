import express from 'express';
import { verifyLogin } from '../utils/loginUtils.mjs';

const loginRouter = express.Router();

/**
 * POST /login
 * Expected body: { "username": "string", "password": "string" }
 */
loginRouter.post('/login', async (req, res) => {
    try {
        // Extract and sanitize input
        const username = String(req.body.username || '').trim();
        const password = String(req.body.password || '').trim();

        console.log('Login attempt:', { username });

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username and password are required'
            });
        }

        // Verify credentials (async for DB or file-based check)
        const isValid = await verifyLogin(username, password);

        if (isValid) {
            return res.status(200).json({
                status: 'success',
                message: 'Login successful'
            });
        } else {
            return res.status(403).json({
                status: 'failed',
                message: 'Invalid username or password'
            });
        }

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            details: err.message
        });
    }
});

export default loginRouter;
