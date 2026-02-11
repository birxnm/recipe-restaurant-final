const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, recipeController.createRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/my', protect, recipeController.getMyRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', protect, recipeController.updateRecipe);
router.delete('/:id', protect, recipeController.deleteRecipe);

module.exports = router;
