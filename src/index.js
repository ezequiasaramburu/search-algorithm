import dotenv from 'dotenv';
import express from 'express';
import searchRouter from './routes/search.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Smart Search API running...');
});

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});

app.use('/search', searchRouter);
