import express from 'express';
import {
  allDishes,
  allRestaurants,
  createCategory,
  createDish,
  createRestaurant,
  searchRestaurant,
  totalDishes,
  totalRestaurants,
} from '../controllers/restaurant.controller.js';

const routes = express.Router();

routes.post('/createRestaurant', createRestaurant);
routes.get('/allRestaurants', allRestaurants);
routes.put('/createCategory/:restaurantId', createCategory);
routes.put('/createdish/:categoryId', createDish);
routes.get('/allDishes/:restaurantId', allDishes);
routes.get('/searchRestaurants', searchRestaurant);
routes.get('/totalRestaurants', totalRestaurants);
routes.get('/totalDishes', totalDishes)

export default routes;
