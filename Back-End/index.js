import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes';
import { config } from './src/config';

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // Note: removed trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = config.PORT || 5000;

// MongoDB connection
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true as any,
  useUnifiedTopology: true as any,
  dbName: 'Alter',
} as any)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
