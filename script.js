import { MongoClient, ObjectId } from 'mongodb';

const mongoUrl = 'mongodb+srv://hungrx001:hungrxmongo@cluster0.ynchc4e.mongodb.net/hungerXTest';
const existingDocId = '67741c00c6db2b3bb11965bb';

const rawData = `Asian Sesame with Chicken - Half 1/2 Salad 200 100 11 1.5 0 40 390 13 3 3 14
Asian Sesame with Chicken - Whole 1 Salad 410 200 22 3 0.5 80 780 26 6 7 29
Caesar Salad with Black Pepper Croutons - Half 1/2 Salad 200 120 14 3.5 0 25 380 12 2 2 5
Caesar Salad with Black Pepper Croutons - Whole 1 Salad 390 250 28 7 0.5 45 760 24 4 4 10
Chicken Caesar Salad with Black Pepper Croutons Half 1/2 Salad 250 130 15 3.5 0.5 60 590 13 2 2 16
Chicken Caesar Salad with Black Pepper Croutons Whole 1 Salad 500 270 30 7 1 125 1180 25 4 5 32
Fuji Apple with Chicken - Half 1/2 Salad 270 150 17 3.5 0 45 410 18 3 11 14
Fuji Apple with Chicken - Whole 1 Salad 550 300 34 7 1 95 830 35 6 21 29
Fuji Apple with Chicken without pecans - Half 1/2 Salad 220 100 12 3 0 45 410 17 2 10 14
Fuji Apple with Chicken without pecans - Whole 1 Salad 450 210 23 6 1 95 830 33 4 21 27
Greek - Half 1/2 Salad 200 160 18 4.5 0 15 540 8 2 3 4
Greek - Whole 1 Salad 400 320 35 9 0.5 30 1080 15 5 7 8
Green Goddess Cobb with Chicken - Half 1/2 Salad 240 120 13 3 0 140 510 12 3 6 18
Green Goddess Cobb with Chicken - Whole 1 Salad 480 240 27 6 0.5 285 1020 25 7 13 37
Southwest Caesar Salad - Half 1/2 Salad 260 200 23 4.5 0 25 330 10 4 2 5
Southwest Caesar Salad - Whole 1 Salad 520 410 45 9 1 55 650 19 8 4 10
Southwest Caesar Salad with Chicken- Whole 1 Salad 630 420 47 10 1 130 1070 21 8 5 32
Southwest Caesar with Chicken Salad - Half 1/2 Salad 310 210 23 5 0.5 65 530 10 4 2 16
`;

function parseDressingsData(rawString) {
    const lines = rawString.trim().split('\n');
    return lines.filter(line => line.trim()).map(line => {
        const parts = line.trim().split(' ');
        if (parts.length < 11) {
            console.warn('Warning: Line has insufficient parts:', line);
            return null;
        }

        const values = parts.slice(-11).map(v => {
            const parsed = parseFloat(v);
            return isNaN(parsed) ? 0 : parsed;
        });
        
        // Find serving size parts
        const servingSizeEnd = parts.findIndex(p => p === parts[parts.length - 11]) - 1;
        const servingSizeStart = parts.findIndex(p => p === '1' || p === '3');
        const servingSize = parts.slice(servingSizeStart, servingSizeEnd + 1).join(' ');
        
        // Get name by excluding serving size and numerical values
        const name = parts.slice(0, servingSizeStart).join(' ');
        
        const item = {
            name,
            servingSize,
            calories: values[0] || 0,
            caloriesFromFat: values[1] || 0,
            fat: values[2] || 0,
            saturatedFat: values[3] || 0,
            transFat: values[4] || 0,
            cholesterol: values[5] || 0,
            sodium: values[6] || 0,
            carbs: values[7] || 0,
            fiber: values[8] || 0,
            sugars: values[9] || 0,
            protein: values[10] || 0
        };

        // Validate the parsed data
        console.log('Parsed item:', item);
        return item;
    }).filter(item => item !== null);
}

async function updateDressingsToMongo() {
    try {
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db('hungerXTest');
        const collection = db.collection('restaurants');

        const dressingsData = parseDressingsData(rawData);
        console.log(`Parsed ${dressingsData.length} items`);
        
        // Validate that we have data before proceeding
        if (!dressingsData.length) {
            throw new Error('No valid data parsed from input');
        }

        const dishesData = dressingsData.map(item => {
            // Ensure all numeric values are converted to strings and have fallbacks
            const nutritionFacts = {
                calories: { value: (item.calories || 0).toString(), unit: "cal" },
                protein: { value: (item.protein || 0).toString(), unit: "g" },
                carbs: { value: (item.carbs || 0).toString(), unit: "g" },
                totalFat: { value: (item.fat || 0).toString(), unit: "g" }
            };

            return {
                dishName: item.name,
                description: "",
                servingInfos: [{
                    servingInfo: {
                        size: item.servingSize,
                        nutritionFacts
                    },
                    _id: new ObjectId(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }],
                _id: new ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date()
            };
        });

        const result = await collection.updateOne(
            { _id: new ObjectId(existingDocId) },
            { 
                $push: {
                    categories: {
                        categoryName: "PASTRIES & SWEETS",
                        dishes: dishesData,
                        _id: new ObjectId(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        subCategories: []
                    }
                }
            }
        );

        console.log('Data updated successfully:', result.modifiedCount);
        await client.close();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

updateDressingsToMongo();