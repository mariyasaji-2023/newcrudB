import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import restaurantRoutes from './/routes/restaurant.route.js';
import { dbConnect } from './lib/db.js';

const app = express();

dotenv.config();

app.use(express.json());

app.use(cors());

app.use('/api/restaurants',restaurantRoutes)


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log(`listening on ${PORT}`);
});
dbConnect();