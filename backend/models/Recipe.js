const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    cuisineType: {
        type: String,
        required: true,
        enum: ['Chinese', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Indian', 'Dessert', 'Other']
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.5
    },
    likesCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
