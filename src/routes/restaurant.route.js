import express from 'express';
import {
  allDishes,
  allRestaurants,
  createCategory,
  createDish,
  createRestaurant,
  deleteRestaurant,
  editRestaurant,
  searchRestaurant,
  totalDishes,
  totalRestaurants,
} from '../controllers/restaurant.controller.js';
import { uploadRestaurantLogo } from '../middlewares/restaurantLogo.middleware.js';

const routes = express.Router();

routes.post('/createRestaurant',uploadRestaurantLogo, createRestaurant);
routes.get('/allRestaurants', allRestaurants);
routes.put('/createCategory/:restaurantId', createCategory);
routes.put('/createdish/:categoryId', createDish);
routes.get('/allDishes/:restaurantId', allDishes);
routes.get('/searchRestaurants', searchRestaurant);
routes.get('/totalRestaurants', totalRestaurants);
routes.get('/totalDishes', totalDishes)
routes.delete('/deleteRestaurant/:restaurantId', deleteRestaurant)
routes.put('/editRestaurant/:restaurantId',uploadRestaurantLogo,editRestaurant)

export default routes;
