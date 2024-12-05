import Restaurant from '../models/restaurant.model.js';
const DEFAULT_LOGO_PATH = '/restaurant-default-logo/restaurantdefaultlogo.webp';

//================================================================
//To create a new restaurant
//================================================================

export const createRestaurant = async (req, res) => {
  try {
    const { restaurantName } = req.body;

    if (!restaurantName) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const existingRestaurant = await Restaurant.findOne({ restaurantName });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'Restaurant already exists' });
    }

    let logoPath = DEFAULT_LOGO_PATH;

    if (req.file) {
      logoPath = req.file.path.replace(/\\/g, '/').replace('public', '');
    }

    const restaurant = new Restaurant({
      restaurantName,
      logo: logoPath,
      categories: [],
    });

    const newRestaurant = await restaurant.save();

    return res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant: newRestaurant,
    });
  } catch (error) {
    console.error('Create restaurant controller error:', error.message);
    res.status(500).json({
      message: 'Error creating restaurant',
      error: error.message,
    });
  }
};

//================================================================
// to show all the restaurants
//================================================================

export const allRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    return res.status(200).json({ restaurants });
  } catch (error) {
    console.log('all restaurants controller error: ', error.message);
    res.status(500).json({ message: 'error fetching restaurants' });
  }
};

//================================================================
// to create categories
//================================================================

export const createCategory = async (req, res) => {
  const { restaurantId } = req.params;
  console.log(restaurantId);

  const { name } = req.body;
  console.log(name);

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    // Fetch the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if the category name already exists in the restaurant
    const categoryExists = restaurant.categories.some(
      (category) => category.name === name
    );

    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Add the new category
    const newCategory = { name, dishes: [] };
    restaurant.categories.push(newCategory);

    // Save the updated restaurant
    await restaurant.save();

    res.status(201).json({
      message: 'Category saved successfully',
      categories: restaurant.categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
//create a new dish
//================================================================

export const createDish = async (req, res) => {
  const { categoryId } = req.params;
  console.log(categoryId);
  const {
    name,
    servingInfo: { size, unit, equivalentTo },
    nutritionFacts: { calories, totalFat, protein },
  } = req.body;
  console.log(name);

  // Validate required fields
  if (
    !name ||
    !size ||
    !unit ||
    !equivalentTo ||
    !calories ||
    !totalFat ||
    !protein
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const restaurant = await Restaurant.findOne({
      'categories._id': categoryId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const category = restaurant.categories.find(
      (cat) => cat._id.toString() === categoryId
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const dishExists = category.dishes.some((dish) => dish.name === name);

    if (dishExists) {
      return res.status(400).json({ message: 'Dish already exists' });
    }

    // Create the new dish
    const newDish = {
      name,
      servingInfo: { size, unit, equivalentTo },
      nutritionFacts: { calories, totalFat, protein },
    };

    category.dishes.push(newDish);

    // Save the restaurant with the new dish in the category
    await restaurant.save();

    res.status(201).json({
      message: 'Dish created successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
//list of all dishes of a restaurant
//================================================================

export const allDishes = async (req, res) => {
  try {
  } catch (error) {}
};

//================================================================
// To search for restaurants
//================================================================

export const searchRestaurant = async (req, res) => {
  const { query } = req.query; // query parameter passed by the user

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    // Search by restaurant name, category name, or dish name
    const restaurant = await Restaurant.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive match on restaurant name
        { 'categories.name': { $regex: query, $options: 'i' } }, // Case-insensitive match on category name
        { 'categories.dishes.name': { $regex: query, $options: 'i' } }, // Case-insensitive match on dish name
      ],
    });

    if (restaurant.length === 0) {
      return res.status(404).json({ message: 'No matching restaurants found' });
    }

    return res.status(200).json({ restaurant });
  } catch (error) {
    console.log('search restaurant controller error: ', error.message);
    return res.status(500).json({
      message: 'Error searching for restaurants',
      error: error.message,
    });
  }
};

//================================================================
// Get total number of restaurants
//================================================================

export const totalRestaurants = async (req, res) => {
  try {
    // Count the total number of restaurants in the collection
    const count = await Restaurant.countDocuments();
    console.log(count);

    return res.status(200).json({
      message: 'Total number of restaurants fetched successfully',
      totalRestaurants: count,
    });
  } catch (error) {
    console.error('totalRestaurants error: ', error.message);
    res
      .status(500)
      .json({
        message: 'Error fetching total restaurants',
        error: error.message,
      });
  }
};

//================================================================
//total number of dishes
//================================================================

export const totalDishes = async (req, res) => {
  try {
    // Fetch all restaurants
    const restaurants = await Restaurant.find();

    // Calculate the total number of dishes
    let totalDishes = 0;
    restaurants.forEach((restaurant) => {
      restaurant.categories.forEach((category) => {
        totalDishes += category.dishes.length;
      });
    });

    console.log('Total Dishes:', totalDishes);

    return res.status(200).json({
      message: 'Total number of dishes fetched successfully',
      totalDishes: totalDishes,
    });
  } catch (error) {
    console.error('totalDishes error:', error.message);
    res
      .status(500)
      .json({ message: 'Error fetching total dishes', error: error.message });
  }
};
