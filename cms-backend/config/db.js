const mongoose = require('mongoose')
const connection = require('./connection')
const Course = require('../model/Course')

mongoose.connect(process.env.MONGODB || connection.connectionString, {useNewUrlParser: true})
.then(() =>{
    console.log('Mongo DB Connected')
}, err => {
    console.log('Invalid Mongo DB Connection')
})

module.exports = {
    Course
}