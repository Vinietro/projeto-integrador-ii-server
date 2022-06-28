const { databaseVersion } = require('../dbConnection');
const Ingredient = require('../models/Ingredient');

module.exports.createIngredient = async (req,res) => {
    try{
        if(!req.body.ingredient.name) throw new Error("Nome é obrigatório")

        const ingredient = await Ingredient.create({
            name: req.body.ingredient.name
        })
        
        if(ingredient){
            res.status(201).json({ingredient})
        }    
    }catch (e){
        res.status(422).json({errors: { body: [ 'Não foi possível criar o alergênico ', e.message ] }})
    }   
}

module.exports.getAllIngredients = async(req,res) => {
    try{
        const getIngredients = await Ingredient.findAll();
        const ingredients = []
        if(getIngredients)
            for(let ingredient of getIngredients){
                ingredients.push(ingredient.dataValues.name)
            }
        res.status(200).json({ingredients})
    }catch(e){
        res.status(422).json({errors: { body: [  e.message ] }})
    }
}