var express = require('express');
const app = express();
const FileWrite = require('./fileWrite')
var cors = require('cors')
// const Data = require('../model/posts')


function startServer(hostname, port) {
    app.use(cors())
    app.get('/', function(req, res, next){
        res.send('hello world')
    })
    app.get('/courses', function(req, res, next){
        
        var courses = FileWrite.readAll();
        if(courses.length){
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.status(200).send({
                responseCode: "200",
                responseDescription: "Processed Ok",
                data: courses
            })
        }
        else{
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.status(400).send({
                responseCode: "404",
                responseDescription: "No data found"
            })
        }
        
    })
    app.post('/courses', function(req, res, next){
        var course = req.query
        var check = FileWrite.writeNew(course)
        if (check === "Processed Ok"){
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.status(200).send({
                responseCode: "200",
                responseDescription: check
            })
        }
        else{
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.status(400).send({
                responseCode: "404",
                responseDescription: check
            })
        }
    })
    app.options('/courses/:id', cors())
    app.put('/courses/:id',cors(), function(req, res, next){
        var course = req.query
        course.id = parseInt(req.params.id) 
        var check = FileWrite.update(course);
        
        if (check === "Processed Ok"){
            res.set('Access-Control-Allow-Origin', '*')
            res.set('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE')
            res.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
            res.status(200).send({
                responseCode: "200",
                responseDescription: check
            })
        }
        else{
            res.set('Access-Control-Allow-Origin', '*')
            res.set('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE')
            res.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
            res.status(400).send({
                responseCode: "404",
                responseDescription: check
            })
        }
    })
    app.options('/courses/:id', cors())
    app.delete('/courses/:id',cors(), function(req, res, next){
        var id = parseInt(req.params.id) 
        var check = FileWrite.deleteSingle(id);
        
        if (check === "Processed Ok"){
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.status(200).send({
                responseCode: "200",
                responseDescription: check
            })
        }
        else{
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.status(400).send({
                responseCode: "404",
                responseDescription: check
            })
        }
    })
    app.listen(port, () => {
        console.log(`server running on port ${port}`)
    });
}
module.exports = {
    startServer
};