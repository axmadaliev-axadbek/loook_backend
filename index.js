import express from 'express'
import path  from 'path'
import { read, write} from './utils/model.js'
const PORT = process.env.PORT || 8008
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('*', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next()
})
app.get('/users', (req, res) =>  {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let users = read('users')
    res.send(users)
}) 

app.post('/users', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    let users = read('users')
    let data = req.body
    data.userId = users.length ? users.at(-1).userId + 1 : 1
    users.push(data)
    write('users', users)
    res.send(data)
})

///

app.get('/foods', (req,res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    let foods = read('foods')
    res.send(foods)
})

//// ORDERS //////

app.get('/orders', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    let {userId} = req.query
    let users = read('users')
    let foods = read('foods')
    let orders = read('orders')
    orders.map(order => {
        order.user = users.find(user => user.userId == order.userId)
        order.foods = foods.find(food => food.foodId == order.foodId)
        delete order.foodId 
    })
    if(userId) {
        orders = orders.filter(order => order.userId == userId)
        res.send(orders)     
    } else{
        res.send(orders)
    }
})


app.post('/orders', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    let data = req.body

    const {userId, foodId, count } = data
    console.log(data);
    let orders = read('orders')

    let order = orders.find(order => order.foodId == foodId && order.userId == userId)
    if(order) {
        order.count = Number(order.count) + Number(count)
    }else {
        order = {
            userId: userId,
            foodId: foodId,
            count: Number(count),
        }
        orders.push(order)
    }
    write('orders', orders)
    res.send( order)
})

app.listen(PORT, () => console.log(`${PORT} - run`))