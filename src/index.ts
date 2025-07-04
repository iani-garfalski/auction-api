import app from './app';

if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => {
    dotenv.config();
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Auction API running on http://localhost:${PORT}`);
});
