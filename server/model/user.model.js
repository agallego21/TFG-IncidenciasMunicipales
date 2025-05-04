const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	id: Number,
	nombreCompleto: String,
	username: String,
	password: String
})

const User = mongoose.model('user', userSchema)

module.exports = User