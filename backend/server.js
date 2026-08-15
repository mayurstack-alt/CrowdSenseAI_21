import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/supabaseAdmin.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'Server running' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
