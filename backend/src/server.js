import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import stateRoutes from './routes/stateRoutes.js';
import cityRoutes from './routes/cityRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'jalmap-backend', timestamp: new Date().toISOString() });
});

app.use('/api', stateRoutes);
app.use('/api', cityRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`JalMap backend running on http://localhost:${PORT}`);
});
