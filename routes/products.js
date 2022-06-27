const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/products')
const {authByToken} = require('../middleware/auth')

router.post('/products', authByToken, ProductController.createProduct)                    

module.exports = router
