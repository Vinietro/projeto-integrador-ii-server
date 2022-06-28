const {decode} = require('../utils/jwt')

module.exports.authByToken = async (req,res,next) => {
    
    const authHeader = req.header('Authorization') ? req.header('Authorization').split(' ') : null
    
    if(!authHeader){
        return res.status(422).json({
            errors: { body: [ 'Authorization failed', 'No Authorization header' ] }
        })
    }

    if(authHeader[0] !== 'Token')
        return res.status(401).json({
            errors: { body: [ 'Authorization failed', 'Token missing' ] }
        })

    const token = authHeader[1];
    try{
        const user = await decode(token)
        if(!user) 
            throw new Error('No user found in token')
        req.user = user
        return next()
    }catch(e) {
        return res.status(401).json({
            errors: { body: [ 'Authorization failed', e.message ] }
        })
    }
        
}
