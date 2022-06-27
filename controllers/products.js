const { databaseVersion } = require('../dbConnection');
const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');

module.exports.createProduct = async (req,res) => {
    try{
        if(!req.body.product.name) throw new Error("Nome é obrigatório")
        if(!req.body.product.ingredients) throw new Error("Lista de ingredientes é obrigatório")

        const product = await Product.create({
            name: req.body.product.name,
            image: req.body.product.image,
            UserUsername: req.user.username,
         })

        if(product){
            req.body.product.ingredients.forEach(async ingredientId =>  {
                const ingredient = await Ingredient.findByPk(ingredientId)
                await product.addIngredient(ingredient, { through: 'ProductIngredients' });
            })
        
            res.status(201).json({product})
        }    
    }catch (e){
        res.status(422).json({errors: { body: [ 'Não foi possível criar o produto ', e.message ] }})
    }   
}