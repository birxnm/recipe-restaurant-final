/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

const recipes = [
    {
        title: 'Classic Pad Thai',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Thai',
        description: 'Stir-fried rice noodle dish commonly served as a street food and at most restaurants in Thailand.',
        ingredients: ['Rice Noodles', 'Shrimp', 'Tofu', 'Peanuts', 'Bean Sprouts', 'Egg', 'Pad Thai Sauce'],
        instructions: '1. Soak noodles. 2. Stir fry shrimp and tofu. 3. Add egg and noodles. 4. Mix in sauce and peanuts.'
    },
    {
        title: 'Spicy Tonkotsu Ramen',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Japanese',
        description: 'Rich pork bone broth with noodles, chashu pork, and a soft-boiled egg.',
        ingredients: ['Ramen Noodles', 'Pork Broth', 'Chashu Pork', 'Soft Boiled Egg', 'Green Onions', 'Nori', 'Chili Oil'],
        instructions: '1. Prepare broth. 2. Cook noodles. 3. Assemble bowl with toppings.'
    },
    {
        title: 'Kung Pao Chicken',
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Chinese',
        description: 'A spicy, stir-fried Chinese dish made with cubes of chicken, peanuts, vegetables, and chili peppers.',
        ingredients: ['Chicken Breast', 'Peanuts', 'Dried Chili Peppers', 'Sichuan Peppercorns', 'Scallions', 'Soy Sauce'],
        instructions: '1. Marinate chicken. 2. Stir fry aromatics. 3. Add chicken and sauce. 4. Finish with peanuts.'
    },
    {
        title: 'Vietnamese Pho Ga',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Vietnamese',
        description: 'A comforting chicken noodle soup with aromatic broth and fresh herbs.',
        ingredients: ['Rice Noodles', 'Chicken Broth', 'Ginger', 'Star Anise', 'Chicken Thighs', 'Fresh Basil', 'Lime'],
        instructions: '1. Simmer broth with spices. 2. Cook noodles. 3. Top with chicken and herbs.'
    },
    {
        title: 'Butter Chicken',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Indian',
        description: 'Chicken prepared in a buttery gravy with cream, giving the curry sauce a silky smooth rich texture.',
        ingredients: ['Chicken', 'Tomato Puree', 'Heavy Cream', 'Butter', 'Garam Masala', 'Fenugreek Leaves'],
        instructions: '1. Marinate chicken. 2. Cook chicken. 3. Simmer sauce. 4. Combine and serve with naan.'
    },
    {
        title: 'Kimchi Jjigae',
        image: 'https://images.unsplash.com/photo-1583213271709-646df7c1a84b?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Korean',
        description: 'A spicy Korean stew made with kimchi, pork belly, and tofu.',
        ingredients: ['Kimchi', 'Pork Belly', 'Tofu', 'Gochujang', 'Onion', 'Garlic'],
        instructions: '1. Sauté pork and kimchi. 2. Add water and seasonings. 3. Add tofu and boil.'
    },
    {
        title: 'Sushi Platter',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Japanese',
        description: 'Assorted fresh nigiri and maki rolls.',
        ingredients: ['Sushi Rice', 'Fresh Salmon', 'Tuna', 'Nori', 'Cucumber', 'Avocado', 'Wasabi'],
        instructions: '1. Cook sushi rice. 2. Prepare toppings. 3. Roll or shape sushi.'
    },
    {
        title: 'Green Curry',
        image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Thai',
        description: 'A central Thai variety of curry that is sweet and spicy.',
        ingredients: ['Green Curry Paste', 'Coconut Milk', 'Chicken', 'Eggplant', 'Thai Basil', 'Kaffir Lime Leaves'],
        instructions: '1. Fry curry paste. 2. Add coconut milk. 3. Simmer meat and veggies.'
    },
    {
        title: 'Dim Sum Dumplings',
        image: 'https://images.unsplash.com/photo-1563245394-57d5c029d3d3?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Chinese',
        description: 'Steamed shrimp and pork dumplings.',
        ingredients: ['Wrapper', 'Shrimp', 'Ground Pork', 'Bamboo Shoots', 'Sesame Oil'],
        instructions: '1. Make filling. 2. Wrap dumplings. 3. Steam in bamboo basket.'
    },
    {
        title: 'Bibimbap',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Korean',
        description: 'Korean mixed rice with meat and assorted vegetables.',
        ingredients: ['Rice', 'Beef', 'Spinach', 'Bean Sprouts', 'Carrots', 'Egg', 'Gochujang'],
        instructions: '1. Cook rice. 2. Sauté veggies separately. 3. Assemble and top with egg.'
    },
    {
        title: 'Chicken Tikka Masala',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Indian',
        description: 'Chunks of roasted marinated chicken in a spiced curry sauce.',
        ingredients: ['Chicken', 'Yogurt', 'Tomato Sauce', 'Cream', 'Cumin', 'Coriander'],
        instructions: '1. Marinate and grill chicken. 2. Make sauce. 3. Simmer together.'
    },
    {
        title: 'Banh Mi',
        image: 'https://images.unsplash.com/photo-1600454021970-351effec658e?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Vietnamese',
        description: 'A savory Vietnamese sandwich with pate, meats, and pickled vegetables.',
        ingredients: ['Baguette', 'Pate', 'Pork Roll', 'Pickled Daikon & Carrot', 'Cilantro', 'Jalapeno'],
        instructions: '1. Toast baguette. 2. Spread pate/mayo. 3. Layer meats and veggies.'
    },
    {
        title: 'Tom Yum Goong',
        image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Thai',
        description: 'Hot and sour Thai soup with shrimp.',
        ingredients: ['Shrimp', 'Lemongrass', 'Galangal', 'Kaffir Lime Leaves', 'Chili', 'Mushrooms'],
        instructions: '1. Boil herbal broth. 2. Add shrimp and mushrooms. 3. Season with lime and fish sauce.'
    },
    {
        title: 'Peking Duck',
        image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Chinese',
        description: 'Crispy roasted duck served with pancakes and hoisin sauce.',
        ingredients: ['Whole Duck', 'Honey', 'Soy Sauce', 'Pancakes', 'Scallions', 'Hoisin Sauce'],
        instructions: '1. Air-dry duck. 2. Glaze and roast. 3. Slice and serve with wrappers.'
    },
    {
        title: 'Nasi Goreng',
        image: 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Other',
        description: 'Indonesian fried rice with sweet soy sauce.',
        ingredients: ['Rice', 'Kecap Manis', 'Shrimp Paste', 'Shallots', 'Garlic', 'Chili'],
        instructions: '1. Fry aromatics. 2. Add rice and sauces. 3. Serve with egg and prawn crackers.'
    },
    {
        title: 'Beef Rendang',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Other',
        description: 'Rich and tender coconut beef stew from Indonesia.',
        ingredients: ['Beef', 'Coconut Milk', 'Lemongrass', 'Galangal', 'Turmeric', 'Chili'],
        instructions: '1. Blend spice paste. 2. Simmer beef with milk and spices for hours until dry.'
    },
    {
        title: 'Mapo Tofu',
        image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Chinese',
        description: 'Tofu set in a spicy sauce based on douban (fermented bean and chili paste).',
        ingredients: ['Silken Tofu', 'Ground Pork', 'Doubanjiang', 'Sichuan Peppercorns', 'Chili Oil'],
        instructions: '1. Fry pork and paste. 2. Add stock and tofu. 3. Simmer and thicken.'
    },
    {
        title: 'Matcha Ice Cream',
        image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Dessert',
        description: 'A creamy Japanese green tea dessert.',
        ingredients: ['Matcha Powder', 'Heavy Cream', 'Milk', 'Sugar', 'Egg Yolks'],
        instructions: '1. Whisk yolks and sugar. 2. Heat milk/cream. 3. Temper eggs, add matcha, churn.'
    },
    {
        title: 'Miso Soup',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Japanese',
        description: 'Traditional Japanese soup consisting of a dashi stock into which softened miso paste is mixed.',
        ingredients: ['Dashi Stock', 'Miso Paste', 'Tofu', 'Green Onions', 'Wakame Seaweed'],
        instructions: '1. Heat dashi. 2. Add tofu and seaweed. 3. Dissolve miso paste. 4. Garnish with onions.'
    },
    {
        title: 'Fresh Spring Rolls',
        image: 'https://images.unsplash.com/photo-1539115161042-45a8e02d68e2?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Vietnamese',
        description: 'Fresh vegetables, herbs, and shrimp wrapped in rice paper.',
        ingredients: ['Rice Paper', 'Shrimp', 'Vermicelli Noodles', 'Lettuce', 'Mint', 'Peanut Sauce'],
        instructions: '1. Dip rice paper. 2. Layer ingredients. 3. Roll tightly. 4. Serve with sauce.'
    },
    {
        title: 'Beef Bulgogi',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Korean',
        description: 'Thinly sliced beef marinated in a sweet and savory sauce, then grilled.',
        ingredients: ['Ribeye Beef', 'Soy Sauce', 'Sugar', 'Asian Pear', 'Garlic', 'Sesame Oil'],
        instructions: '1. Marinade beef for 1 hour. 2. Grill over high heat. 3. Garnish with sesame seeds.'
    },
    {
        title: 'Yakitori',
        image: 'https://images.unsplash.com/photo-1514355315815-2b64b0216b14?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Japanese',
        description: 'Grilled chicken skewers glazed with tare sauce.',
        ingredients: ['Chicken Thighs', 'Soy Sauce', 'Mirin', 'Sake', 'Sugar', 'Green Onions'],
        instructions: '1. Make tare sauce. 2. Skewer chicken and onions. 3. Grill and baste with sauce.'
    },
    {
        title: 'Som Tum (Papaya Salad)',
        image: 'https://images.unsplash.com/photo-1563889958749-f55ebc402d28?auto=format&fit=crop&w=1000&q=80',
        cuisineType: 'Thai',
        description: 'Spicy green papaya salad.',
        ingredients: ['Green Papaya', 'Chili', 'Garlic', 'Peanuts', 'Fish Sauce', 'Lime', 'Yardlong Beans'],
        instructions: '1. Shred papaya. 2. Pound garlic and chili. 3. Mix everything together.'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Create a demo admin user if not exists
        let adminUser = await User.findOne({ email: 'admin@example.com' });
        if (!adminUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            adminUser = await User.create({
                username: 'ChefAdmin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Clear existing recipes
        await Recipe.deleteMany({});
        console.log('Old recipes removed');

        // Add author to recipes
        const recipesWithAuthor = recipes.map(recipe => ({
            ...recipe,
            author: adminUser._id
        }));

        await Recipe.insertMany(recipesWithAuthor);
        console.log('Data Imported!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
