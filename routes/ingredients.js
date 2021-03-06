const express = require('express')
const router = express.Router()
const IngredientController = require('../controllers/ingredients')

router.post('/ingredients', IngredientController.createIngredient)                    
router.get('/ingredients', IngredientController.getAllIngredients)                    

module.exports = router
