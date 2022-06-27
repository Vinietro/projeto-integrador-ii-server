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
        res.status(422).json({errors: { body: [ 'Não foi possível criar o ingrediente ', e.message ] }})
    }   
}