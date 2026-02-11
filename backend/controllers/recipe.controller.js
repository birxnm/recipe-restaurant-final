const Recipe = require('../models/Recipe');
const Joi = require('joi');

const recipeSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.array().items(Joi.string()).required(),
    instructions: Joi.string().required(),
    cuisineType: Joi.string().valid('Chinese', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Indian', 'Dessert', 'Other').required(),
    image: Joi.string().uri().allow('', null).optional(),
});

exports.createRecipe = async (req, res, next) => {
    try {
        const { error } = recipeSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const recipe = new Recipe({ ...req.body, author: req.user.id });
        await recipe.save();
        res.status(201).json(recipe);
    } catch (err) {
        next(err);
    }
};

exports.getAllRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find().populate('author', 'username email');
        res.json(recipes);
    } catch (err) {
        next(err);
    }
};

exports.getMyRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find({ author: req.user.id }).populate('author', 'username email');
        res.json(recipes);
    } catch (err) {
        next(err);
    }
};

exports.getRecipeById = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('author', 'username email');

        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        // Increment views
        recipe.views = (recipe.views || 0) + 1;
        await recipe.save();

        res.json(recipe);
    } catch (err) {
        next(err);
    }
};

exports.updateRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        if (recipe.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'User not authorized' });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRecipe);
    } catch (err) {
        next(err);
    }
};

exports.deleteRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        if (recipe.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'User not authorized' });
        }

        await recipe.deleteOne();
        res.json({ message: 'Recipe removed' });
    } catch (err) {
        next(err);
    }
};
