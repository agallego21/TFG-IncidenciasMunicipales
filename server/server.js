const express = require('express')

const app = express()

//DB Connecton
const mongoose = require('mongoose')
mongoose
	//.connect('mongodb+srv://testing:Test_24!.@dbcluster0.2jre5ex.mongodb.net/testingDB')
	.connect('mongodb+srv://agallego:TFG_25!.@cluster0.jq9m4ia.mongodb.net/TFG_GestIncidencias_db')
	.then(() => console.log('DB Connected'))
	
//Model
const User = require('./model/user.model.js')

// CORS config
const cors = require('cors')
let corsOptions = {
   origin : ['http://localhost:3000'],
}
app.use(cors(corsOptions))


//Routing
app.get('/', (req, res) => res.send('<h1>SERVER STARTED</h1>'))

app.get('/api/users', (req, res) => {
	User
		.find()
		.then(allUsers => res.json(allUsers))
})

app.get('/api/users/:user_id', (req, res) => {
	
	const {user_id} = req.params
	User
		.findById(user_id)
		.then(user => res.json(user))
})

app.get('/api/users/username/:user_name', (req, res) => {
	
	const {user_name} = req.params
	User
		.findOne({'username': user_name})
		.then(user => res.json(user))
})

app.listen(5005, ()=>console.log('Server started'))


