import express from 'express';
import { pay, getBalance } from '../utils/payUtils.mjs';

const paymentRouter = express.Router();

/**
 * POST /payment
 * Expected body: { "amount": number }
 */
paymentRouter.post('/payment', async (req, res) => {
    try {
        // Extract and validate amount
        const amount = Number(req.body.amount);

        if (isNaN(amount)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid or missing amount. Please provide a numeric value.'
            });
        }

        if (amount <= 0) {
            return res.status(403).json({
                status: 'failed',
                message: 'Amount must be greater than zero.'
            });
        }

        const balance = await getBalance();

        if (amount > balance) {
            return res.status(402).json({
                status: 'failed',
                message: 'Insufficient funds.',
                currentBalance: balance
            });
        }

        await pay(amount);

        return res.status(200).json({
            status: 'success',
            message: `Payment of ₹${amount} successful.`,
            remainingBalance: await getBalance()
        });

    } catch (err) {
        console.error('Payment error:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            details: err.message
        });
    }
});

/**
 * GET /balance
 * Returns current balance
 */
paymentRouter.get('/balance', async (_req, res) => {
    try {
        const balance = await getBalance();
        return res.status(200).json({
            status: 'success',
            balance
        });
    } catch (err) {
        console.error('Balance error:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve balance',
            details: err.message
        });
    }
});

export default paymentRouter;
