import express from 'express';
import auctionRoutes from './routes/auctionRoutes';

const app = express();

app.use(express.json());
app.use('/api', auctionRoutes);

app.get('/', (req, res) => {
  res.send('Auction API running...');
});
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

export default app;
