const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseTitle: {
        type: String,
        min: "3",
        max: "15",
        required: true
    },
    instructor: {
        type: String,
        min: 3,
        max: 15,
        required: true
    }
})

module.exports = mongoose.model('Course', CourseSchema)