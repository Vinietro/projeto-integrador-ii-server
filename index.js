const dotenv = require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const {notFound,errorHandler} = require('./middleware/errorHandler')
const sequelize = require('./dbConnection')

const User = require('./models/User')
const Product = require('./models/Product')
const Ingredient = require('./models/Ingredient')

const userRoute = require('./routes/users')
const productRoute = require('./routes/products')
const ingredientRoute = require('./routes/ingredients')

const app = express()

app.use(cors({credentials: true, origin: true})) 

User.hasMany(Product,{onDelete: 'CASCADE'})
Product.belongsTo(User)

Product.belongsToMany(Ingredient,{through: 'ProductIngredients', uniqueKey: 'id', targetKey:'id', foreignKey:'productId', timestamps:false})
Ingredient.belongsToMany(Product,{through: 'ProductIngredients', uniqueKey: 'id', targetKey:'id', foreignKey:'ingredientId', timestamps:false})

const sync = async () => await sequelize.sync({alter:true})
sync()

app.use(express.json())
app.use(morgan('tiny'))


app.get('/',(req,res) => {
    res.json({status:"API is running"});
})
app.use('/api',userRoute, productRoute, ingredientRoute)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(PORT,() => {
    console.log(`Server running on http://localhost:8080`);
})