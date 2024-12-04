import mongoose from 'mongoose';

// Dish Schema
const dishSchema = new mongoose.Schema(
  {
    dishName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    servingInfo: {
      size: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
    nutritionFacts: {
      calories: {
        value: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          default: 'kcl',
        },
      },
      protein: {
        value: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          default: 'g',
        },
      },
      carbs: {
        value: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          default: 'g',
        },
      },
      totalFat: {
        value: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          default: 'g',
        },
      },
    },
  },
  { timestamps: true }
);

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    subCategoryName: {
      type: String,
      required: false,
    },
    dishes: [dishSchema], // Array of dishes under this category
  },
  { timestamps: true }
);

// Restaurant Schema
const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: '',
    },
    categories: [categorySchema], // Array of categories within a restaurant
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
