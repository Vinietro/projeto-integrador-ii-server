const { databaseVersion } = require('../dbConnection');
const User = require('../models/User');
const {hashPassword,matchPassword} = require('../utils/password')
const {sign,decode} = require('../utils/jwt')


module.exports.createUser = async (req,res) => {
    try{
        if(!req.body.user.username) throw new Error("Usuário é obrigatório")
        if(!req.body.user.name) throw new Error("Nome é obrigatório")
        if(!req.body.user.password) throw new Error("Senha é obrigatório")
        
        const existingUser = await User.findByPk(req.body.user.username)
        if(existingUser)
            throw new Error('Usuário já existe em nosso sistema')

        const password = await hashPassword(req.body.user.password);
        const user = await User.create({
            username: req.body.user.username,
            password: password,
            name: req.body.user.name
        })
        
        if(user){
            if(user.dataValues.password)
                delete user.dataValues.password
            user.dataValues.token = await sign(user)
            user.dataValues.image = null
            res.status(201).json({user})
        }    
    }catch (e){
        res.status(422).json({errors: { body: [ 'Não foi possível criar o usuário ', e.message ] }})
    }   
}

module.exports.loginUser = async (req,res) => {
    try{
        if(!req.body.user.username) throw new Error('Usuário é obrigatório')
        if(!req.body.user.password) throw new Error('Senha é obrigatório')

        const user = await User.findByPk(req.body.user.username)

        if(!user){
            res.status(401)
            throw new Error('Nenhum usuário encontrado')
        }
        
        const passwordMatch = await matchPassword(user.password,req.body.user.password)

        if(!passwordMatch){
            res.status(401)
            throw new Error('Senha inválida')
        }
            
        delete user.dataValues.password
        user.dataValues.token = await sign({email: user.dataValues.email,username:user.dataValues.username})

        res.status(200).json({user})
    }catch(e){
        const status = res.statusCode ? res.statusCode : 500
        res.status(status).json({errors: { body: [ 'Não foi possível logar no sistema ', e.message ] }})
    }
}

module.exports.getUserByUsername = async (req,res) => {
    try{
        const user = await User.findByPk(req.user.username)
        if(!user){
            throw new Error('Usuário não encontrado')
        }
        delete user.dataValues.password
        user.dataValues.token = req.header('Authorization').split(' ')[1]
        return res.status(200).json({user})
    }catch(e){
        return res.status(404).json({
            errors: { body: [ e.message ] }
        })
    }
}

module.exports.updateUserDetails = async (req,res) => {
    try{
        const user = await User.findByPk(req.user.username)

        if(!user){
            res.status(401)
            throw new Error('Nenhum usuário encontrado')
        }
            
        
        if(req.body.user){
            const name = req.body.user.name ? req.body.user.name : user.name
            const image = req.body.user.image ? req.body.user.image : user.image
            let password = user.password
            if(req.body.user.password)
                password = await hashPassword(req.body.user.password)

            const updatedUser = await user.update({name,image,password})
            delete updatedUser.dataValues.password
            updatedUser.dataValues.token = req.header('Authorization').split(' ')[1]
            res.json(updatedUser)
        }else{
            delete user.dataValues.password
            user.dataValues.token = req.header('Authorization').split(' ')[1]
            res.json(user)
        }
        
    }catch(e){
        const status = res.statusCode ? res.statusCode : 500
        return res.status(status).json({
            errors: { body: [ e.message ] }
        })
    }
    
}