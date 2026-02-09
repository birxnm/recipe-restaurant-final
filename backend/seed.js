const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./models/Recipe');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const recipes = [
    {
        title: "Classic Pad Thai",
        description: "A popular Thai street food dish with rice noodles, tofu, shrimp, and a tangy tamarind sauce.",
        ingredients: ["200g Rice noodles", "100g Tofu", "100g Shrimp", "2 tbsp Tamarind paste", "1 tbsp Fish sauce", "1 tbsp Palm sugar", "Bean sprouts", "Peanuts"],
        instructions: "1. Soak noodles. 2. Stir-fry shrimp and tofu. 3. Add noodles and sauce. 4. Toss with sprouts and peanuts.",
        cuisineType: "Thai",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Ramen with Chashu",
        description: "Rich tonkotsu broth served with tender pork belly, soft-boiled egg, and springy noodles.",
        ingredients: ["Ramen noodles", "Pork belly", "Miso paste", "Dashi stock", "Bamboo shoots", "Scallions", "Nori", "Soft-boiled egg"],
        instructions: "1. Prepare broth for 12 hours. 2. Cook noodles. 3. Assemble with toppings and hot broth.",
        cuisineType: "Japanese",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Bibimbap",
        description: "A colorful Korean rice bowl topped with seasoned vegetables, meat, and a spicy gochujang sauce.",
        ingredients: ["Steamed rice", "Bulgogi beef", "Carrots", "Spinach", "Bean sprouts", "Mushrooms", "Fried egg", "Gochujang paste"],
        instructions: "1. Sauté vegetables. 2. Brown the beef. 3. Arrange over rice. 4. Top with egg and serve with sauce.",
        cuisineType: "Korean",
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Kung Pao Chicken",
        description: "A spicy, stir-fried Chinese dish made with chicken, peanuts, vegetables, and chili peppers.",
        ingredients: ["Chicken breast", "Peanuts", "Dried chilies", "Bell peppers", "Soy sauce", "Shaoxing wine", "Ginger", "Garlic"],
        instructions: "1. Marinate chicken. 2. Stir-fry aromatics. 3. Add chicken and peppers. 4. Finish with peanuts and sauce.",
        cuisineType: "Chinese",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Beef Pho",
        description: "The national dish of Vietnam—a fragrant noodle soup with delicate beef slices and fresh herbs.",
        ingredients: ["Beef bones", "Rice noodles", "Thinly sliced beef", "Star anise", "Cinnamon", "Ginger", "Onion", "Basil", "Lime"],
        instructions: "1. Simmer broth for 6 hours. 2. Blanch noodles. 3. Pour boiling broth over raw beef and noodles.",
        cuisineType: "Vietnamese",
        image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Butter Chicken",
        description: "A creamy, mildly spiced Indian curry made with tender chicken in a rich tomato and butter sauce.",
        ingredients: ["Chicken thighs", "Tomato puree", "Cream", "Butter", "Ginger-garlic paste", "Garam masala", "Cumin", "Turmeric"],
        instructions: "1. Marinate and grill chicken. 2. Prepare tomato-butter gravy. 3. Simmer chicken in sauce.",
        cuisineType: "Indian",
        image: "https://images.unsplash.com/photo-1603894584114-f06b47ccdf58?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Green Thai Curry",
        description: "A spicy and aromatic Thai curry made with green chili paste, coconut milk, and basil.",
        ingredients: ["Green curry paste", "Coconut milk", "Chicken", "Bamboo shoots", "Thai basil", "Fish sauce", "Palm sugar"],
        instructions: "1. Fry curry paste. 2. Add coconut milk. 3. Simmer with chicken and vegetables until tender.",
        cuisineType: "Thai",
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Sushi Platter",
        description: "A variety of fresh nigiri and maki rolls featuring salmon, tuna, and avocado.",
        ingredients: ["Sushi rice", "Nori sheets", "Fresh salmon", "Tuna", "Cucumber", "Avocado", "Wasabi", "Soy sauce"],
        instructions: "1. Prepare seasoned rice. 2. Slice fish carefully. 3. Roll maki or hand-form nigiri.",
        cuisineType: "Japanese",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Kimchi Jjigae",
        description: "A comforting Korean stew made with aged kimchi, tofu, and pork.",
        ingredients: ["Aged kimchi", "Pork belly", "Tofu", "Onion", "Garlic", "Gochugaru (chili flakes)", "Green onion"],
        instructions: "1. Sauté pork and kimchi. 2. Add water and seasonings. 3. Simmer until flavorful, add tofu last.",
        cuisineType: "Korean",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Mapo Tofu",
        description: "A spicy and numbing Sichuan dish made with silken tofu and minced meat in a bean-based sauce.",
        ingredients: ["Silken tofu", "Minced pork", "Doubanjiang", "Sichuan peppercorns", "Garlic", "Ginger", "Chili oil"],
        instructions: "1. Fry meat and aromatics. 2. Add paste and water. 3. Gently fold in tofu and simmer.",
        cuisineType: "Chinese",
        image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Summer Rolls",
        description: "Fresh Vietnamese spring rolls with shrimp, herbs, and vermicelli wrapped in rice paper.",
        ingredients: ["Rice paper", "Shrimp", "Vermicelli noodles", "Mint", "Cilantro", "Lettuce", "Peanut dipping sauce"],
        instructions: "1. Dip rice paper in water. 2. Layer shrimp, noodles, and herbs. 3. Roll tightly and serve fresh.",
        cuisineType: "Vietnamese",
        image: "https://images.unsplash.com/photo-1528137858148-d018f307324c?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Paneer Tikka Masala",
        description: "Grilled cubes of paneer cheese in a spiced tomato cream sauce.",
        ingredients: ["Paneer", "Yogurt", "Tomato puree", "Ginger", "Garlic", "Garam masala", "Coriander", "Heavy cream"],
        instructions: "1. Marinate and grill paneer. 2. Cook tomato-based masala. 3. Add paneer and cream to finish.",
        cuisineType: "Indian",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Tom Yum Soup",
        description: "A vibrant Thai soup balancing hot, sour, and salty flavors with shrimp and mushrooms.",
        ingredients: ["Shrimp", "Lemongrass", "Galangal", "Kaffir lime leaves", "Mushrooms", "Fish sauce", "Lime juice", "Chili paste"],
        instructions: "1. Boil aromatics. 2. Add mushrooms and shrimp. 3. Season with lime and fish sauce after heat is off.",
        cuisineType: "Thai",
        image: "https://images.unsplash.com/photo-1548943487-a2e4e43eb477?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Chicken Teriyaki",
        description: "Grilled chicken glazed with a sweet and savory soy-based sauce.",
        ingredients: ["Chicken thighs", "Soy sauce", "Mirin", "Sake", "Sugar", "Ginger", "Sesame seeds"],
        instructions: "1. Pan-fry chicken. 2. Add sauce ingredients. 3. Reduce until sticky and glaze the chicken.",
        cuisineType: "Japanese",
        image: "https://images.unsplash.com/photo-1598514983318-29141915b9d0?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Korean Fried Chicken",
        description: "Extremely crunchy double-fried chicken coated in a spicy-sweet soy garlic glaze.",
        ingredients: ["Chicken wings", "Potato starch", "Gochujang", "Honey", "Soy sauce", "Sesame oil", "Peanuts"],
        instructions: "1. Double-fry chicken wings. 2. Prepare spicy glaze. 3. Toss chicken in sauce while hot.",
        cuisineType: "Korean",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Dim Sum Steamed Buns",
        description: "Soft, fluffy steamed buns (Char Siu Bao) filled with savory barbecue pork.",
        ingredients: ["Yeast dough", "BBQ Pork", "Hoisin sauce", "Oyster sauce", "Sugar", "Sesame oil"],
        instructions: "1. Make dough. 2. Stuff with cooked pork mixture. 3. Steam for 15 minutes.",
        cuisineType: "Chinese",
        image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Banh Mi Sandwich",
        description: "A French-Vietnamese fusion sandwich with pate, pork, pickled vegetables, and fresh cilantro.",
        ingredients: ["Baguette", "Pork belly", "Pate", "Pickled carrots & daikon", "Cilantro", "Cucumber", "Mayonnaise"],
        instructions: "1. Toast baguette. 2. Layer pate and pork. 3. Top with pickles and fresh herbs.",
        cuisineType: "Vietnamese",
        image: "https://images.unsplash.com/photo-1600454021970-351feb4a214e?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Lamb Rogan Josh",
        description: "A slow-cooked Kashmiri curry with tender lamb and aromatic spices.",
        ingredients: ["Lamb shoulder", "Yogurt", "Dried ginger", "Cloves", "Cardamom", "Chili powder", "Saffron"],
        instructions: "1. Brown the lamb. 2. Simmer with spices and yogurt for 2 hours until pieces are tender.",
        cuisineType: "Indian",
        image: "https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Massaman Curry",
        description: "A rich, relatively mild Thai curry that includes peanuts and potatoes.",
        ingredients: ["Massaman paste", "Coconut milk", "Beef chunks", "Potatoes", "Roasted peanuts", "Cinnamon", "Star anise"],
        instructions: "1. Sauté paste. 2. Stew beef and potatoes in coconut milk and spices until soft.",
        cuisineType: "Thai",
        image: "https://images.unsplash.com/photo-1540648639573-8c848de23f0a?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Gyoza Dumplings",
        description: "Pan-fried Japanese dumplings filled with pork, cabbage, and ginger.",
        ingredients: ["Dumpling wrappers", "Ground pork", "Cabbage", "Ginger", "Garlic", "Chives", "Soy-vinegar sauce"],
        instructions: "1. Mix filling. 2. Fold into wrappers. 3. Pan-fry until bottom is golden, then steam.",
        cuisineType: "Japanese",
        image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Nasi Goreng",
        description: "Indonesian fried rice with sweet soy sauce, shallots, garlic, and tamarind.",
        ingredients: ["Rice", "Sweet soy sauce (Kecap Manis)", "Shallots", "Garlic", "Chili", "Egg", "Prawn crackers"],
        instructions: "1. Stir-fry aromatics. 2. Add rice and sauces. 3. Serve with fried egg and crackers.",
        cuisineType: "Other", // or 'Indonesian' if I update enum, but enum has 'Other'
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Laksa",
        description: "Spicy noodle soup popular in Peranakan cuisine, consisting of rice noodles with chicken, prawn or fish, served in spicy soup.",
        ingredients: ["Rice noodles", "Coconut milk", "Curry paste", "Prawns", "Fish cake", "Bean sprouts", "Laksa leaves"],
        instructions: "1. Prepare spicy coconut broth. 2. Cook noodles and toppings. 3. Assemble bowl with broth.",
        cuisineType: "Other",
        image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Chicken Adobo",
        description: "A popular Filipino dish that involves meat, seafood, or vegetables marinated in vinegar, soy sauce, garlic, and black peppercorns.",
        ingredients: ["Chicken", "Soy sauce", "Vinegar", "Garlic", "Bay leaves", "Black peppercorns"],
        instructions: "1. Marinate chicken. 2. Simmer in marinade until tender. 3. Brown meat and reduce sauce.",
        cuisineType: "Other",
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=1000"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // 1. Create a Seed Admin User
        let user = await User.findOne({ email: 'seed-admin@example.com' });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            user = await User.create({
                username: 'Chef Asian Explorer',
                email: 'seed-admin@example.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log("Created seed admin user.");
        }

        // 2. Clear existing recipes (Recommended for fresh seed)
        await Recipe.deleteMany({});
        console.log("Cleared existing recipes.");

        // 3. Add author ID and random stats to each recipe
        const recipesWithAuthor = recipes.map(r => ({
            ...r,
            author: user._id,
            views: Math.floor(Math.random() * 2000) + 500,
            rating: (Math.random() * (5 - 4) + 4).toFixed(1),
            likesCount: Math.floor(Math.random() * 100) + 10
        }));

        // 4. Bulk insert
        await Recipe.insertMany(recipesWithAuthor);
        console.log(`Successfully seeded ${recipes.length} recipes!`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
