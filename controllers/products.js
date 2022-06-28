const { databaseVersion } = require('../dbConnection');
const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');
const User = require('../models/User');

module.exports.createProduct = async (req,res) => {
    try{
        if(!req.body.product.name) throw new Error("Nome é obrigatório")
        if(!req.body.product.ingredientList) throw new Error("Lista de alergênicos é obrigatório")

        const product = await Product.create({
            name: req.body.product.name,
            image: req.body.product.image,
            UserUsername: req.user.username,
         })

        if(product){
            req.body.product.ingredientList.forEach(async ingredientName =>  {
                let ingredient = await Ingredient.findByPk(ingredientName)

                if(!ingredient){
                    ingredient = await Ingredient.create({
                        name: ingredientName
                    })
                }
                await product.addIngredient(ingredient, { through: 'ProductIngredients' });
            })
        
            res.status(201).json({product})
        }    
    }catch (e){
        res.status(422).json({errors: { body: [ 'Não foi possível criar o produto ', e.message ] }})
    }   
}

module.exports.getAllProducts = async (req, res) => {
	try {
		const { ingredient, limit = 20, offset = 0 } = req.query;
		let products = [];
		if (ingredient) {
			products = await Product.findAll({
				include: [
					{
						model: Ingredient,
						attributes: ['name'],
						where: { name: ingredient },
					},
					{
						model: User,
						attributes: ['name', 'image'],
					},
				],
				limit: parseInt(limit),
				offset: parseInt(offset),
			});
		} else {
			products = await Product.findAll({
				include: [
					{
						model: Ingredient,
						attributes: ['name'],
					},
					{
						model: User,
						attributes: ['name', 'image'],
					},
				],
				limit: parseInt(limit),
				offset: parseInt(offset),
			});
		}
		res.json({ products, productsCount: products.length });
	} catch (e) {
		const code = res.statusCode ? res.statusCode : 422;
		return res.status(code).json({
			errors: { body: ['Não foi possível buscar a lista de produtos', e.message] },
		});
	}
};