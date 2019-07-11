var express = require('express');
const app = express();
const FileWrite = require('./fileWrite')
var cors = require('cors')
const db = require('../config/db')
const Course = db.Course;
// const Data = require('../model/posts')


function startServer(hostname, port) {
    app.use(cors())
    app.get('/', function (req, res, next) {
        res.send('hello world')
    })
    app.get('/courses', async function (req, res, next) {
        const courses = await Course.find()
        if (!courses.length) return res.status(400).send({
            responseCode: "404",
            responseDescription: "No data found"
        });
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).send({
            responseCode: "200",
            responseDescription: "Processed Ok",
            data: courses
        })
    })
    app.get('/courses/:id', async function (req, res, next) {
        const course = await Course.findById(req.params.id)
        if (!course) return res.status(400).send({
            responseCode: "404",
            responseDescription: "No data found"
        });
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).send({
            responseCode: "200",
            responseDescription: "Processed Ok",
            data: course
        })
    })
    app.get('/ascending', async function (req, res, next) {
        const courses = await Course.find().sort({_id: 1})
        if (!courses.length) return res.status(400).send({
            responseCode: "404",
            responseDescription: "No data found"
        });
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).send({
            responseCode: "200",
            responseDescription: "Processed Ok",
            data: courses
        })
    })
    app.get('/descending', async function (req, res, next) {
        const courses = await Course.find().sort({_id: -1})
        if (!courses.length) return res.status(400).send({
            responseCode: "404",
            responseDescription: "No data found"
        });
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).send({
            responseCode: "200",
            responseDescription: "Processed Ok",
            data: courses
        })
    })
    app.get('/limit', async function (req, res, next) {
        const courses = await Course.find().limit(3)
        if (!courses.length) return res.status(400).send({
            responseCode: "404",
            responseDescription: "No data found"
        });
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).send({
            responseCode: "200",
            responseDescription: "Processed Ok",
            data: courses
        })
    })
    app.post('/courses', function (req, res, next) {
        var course = req.query
        var check = new Course(course);
        check.save(function (err) {
            if (err) {
                var x = err.errors
                var ind = x[Object.keys(x)[0]]
                console.log(ind.message)
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({
                    responseCode: "404",
                    responseDescription: ind.message
                })
                return
            }
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send({
                responseCode: "200",
                responseDescription: "Processed Ok"
            })
            // saved!
        });
    })
    app.options('/courses/:id', cors())
    app.put('/courses/:id', cors(), function (req, res, next) {
        var course = req.query
        console.log(req.params)
        Course.findByIdAndUpdate(req.params.id, course, function (err) {
            console.log(err)
            if (err) {
                var x = err.errors
                var ind = x[Object.keys(x)[0]]
                console.log(ind.message)
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({
                    responseCode: "404",
                    responseDescription: ind.message
                })
                return
            }
            res.status(400).send({
                responseCode: "200",
                responseDescription: "Processed Ok"
            })
        })
    })
    app.options('/courses/:id', cors())
    app.delete('/courses/:id', cors(), function (req, res, next) {
        Course.findByIdAndDelete(req.params.id, function (err) {
            console.log(err)
            if (err) {
                var x = err.errors
                var ind = x[Object.keys(x)[0]]
                console.log(ind.message)
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({
                    responseCode: "404",
                    responseDescription: ind.message
                })
                return
            }
            res.status(400).send({
                responseCode: "200",
                responseDescription: "Processed Ok"
            })
        })
    })
    app.listen(port, () => {
        console.log(`server running on port ${port}`)
    });
}
module.exports = {
    startServer
};