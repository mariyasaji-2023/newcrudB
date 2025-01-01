// models/Restaurant.js
import Restaurant from '../models/restaurant.model.js';
import mongoose from 'mongoose';

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.createRestaurant = async (req, res) => {
//   try {
//     const restaurant = new Restaurant({
//       name: req.body.name,
//       categories: []
//     });
//     const newRestaurant = await restaurant.save();
//     res.status(201).json(newRestaurant);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.addCategory = async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findById(req.params.restaurantId);
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     restaurant.categories.push({
//       name: req.body.name,
//       subcategories: []
//     });

//     const updatedRestaurant = await restaurant.save();
//     res.json(updatedRestaurant);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const updateCategory = async (req, res) => {
    try {
      const { categoryId, name } = req.body;
      
      console.log('Updating category:', { categoryId, name });
      
      const restaurant = await Restaurant.findOneAndUpdate(
        { 'categories._id': categoryId },
        { 
          $set: { 
            'categories.$.categoryName': name
          } 
        },
        { 
          new: true,
          runValidators: true
        }
      );
      
      console.log('Update result:', restaurant ? 'Found and updated' : 'Not found');
      
      if (!restaurant) {
        console.log('No restaurant found with category:', categoryId);
        return res.status(404).json({ 
          message: 'Category not found',
          requestedCategoryId: categoryId 
        });
      }
      
      const updatedCategory = restaurant.categories.find(
        cat => cat._id.toString() === categoryId
      );
      
      console.log('Updated category:', updatedCategory);
      
      res.json({
        success: true,
        category: updatedCategory
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(400).json({ 
        message: error.message,
        details: error
      });
    }
};
export const deleteCategory = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { 'categories._id': req.params.categoryId },
      { $pull: { categories: { _id: req.params.categoryId } } },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.addSubcategory = async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findOne({ 'categories._id': req.params.categoryId });
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     const category = restaurant.categories.id(req.params.categoryId);
//     category.subcategories.push({
//       name: req.body.name
//     });

//     const updatedRestaurant = await restaurant.save();
//     res.json(updatedRestaurant);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.updateSubcategory = async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findOne({
//       'categories.subcategories._id': req.params.subcategoryId
//     });

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Subcategory not found' });
//     }

//     const category = restaurant.categories.find(cat => 
//       cat.subcategories.some(sub => sub._id.toString() === req.params.subcategoryId)
//     );
    
//     const subcategory = category.subcategories.id(req.params.subcategoryId);
//     subcategory.name = req.body.name;

//     const updatedRestaurant = await restaurant.save();
//     res.json(updatedRestaurant);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const deleteSubcategory = async (req, res) => {
  try {
      // Find the restaurant containing the subcategory
      const restaurant = await Restaurant.findOne({
          'categories.subCategories._id': req.params.subcategoryId
      });

      if (!restaurant) {
          return res.status(404).json({ message: 'Subcategory not found' });
      }

      // Find the category containing the subcategory
      const categoryIndex = restaurant.categories.findIndex(cat =>
          cat.subCategories.some(sub => sub._id.toString() === req.params.subcategoryId)
      );

      if (categoryIndex === -1) {
          return res.status(404).json({ message: 'Category not found' });
      }

      // Filter out the subcategory to delete
      restaurant.categories[categoryIndex].subCategories = 
          restaurant.categories[categoryIndex].subCategories.filter(
              sub => sub._id.toString() !== req.params.subcategoryId
          );

      // Save the updated restaurant
      const updatedRestaurant = await restaurant.save();

      res.json({
          success: true,
          message: 'Subcategory deleted successfully',
          restaurant: updatedRestaurant
      });

  } catch (error) {
      console.error('Error deleting subcategory:', error);
      res.status(500).json({ 
          success: false,
          message: error.message || 'Internal server error'
      });
  }
};