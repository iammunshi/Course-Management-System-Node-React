var fs = require("fs");
const Joi = require('@hapi/joi');
//validation schema
const schema = Joi.object().keys({
    courseTitle: Joi.string().min(3).max(20).required(),
    instructor: Joi.string().min(3).max(30).required()
})
//validation check function
function validation_check(course) {
    var result = Joi.validate({
        courseTitle: course.courseTitle,
        instructor: course.instructor
    }, schema);
    return result;
}

function writeNew(data) {
    var buf = fs.readFileSync("file.txt", "utf8");
    if (buf.toString() === "") {
        var arrayData = [];
        var result = validation_check(data)
        if (result.error) {
            return result.error.details[0].message
        }
        else {
            arrayData.push(data)
            var newData = JSON.stringify(arrayData);
            fs.writeFileSync('file.txt', newData)
            console.log(arrayData)
            return "Processed Ok"
        }
    }
    else {
        var read = buf.toString()
        var readData = JSON.parse(read);
        var result = validation_check(data)
        if (result.error) {
            return result.error.details[0].message
        }
        else {
            var len = readData.length
            var id = 0;
            if (len) {
                id = readData[len - 1].id + 1;
            }
            else {
                id = 1;
            }
            data.id = id;
            readData.push(data)
            var newData = JSON.stringify(readData);
            fs.writeFileSync('file.txt', newData)
            console.log(readData)
            return "Processed Ok"
        }
    }
}
function readAll() {
    var names = new Array();
    var data = fs.readFileSync("file.txt")
    if (data.toString() === "") {
        console.log("Nothing to show!")
        return names;
    }
    else {
        var read = data.toString();
        console.log(read)
        var readData = JSON.parse(read);
        console.log(readData)

        names = readData
        return names;
    }
}
function readSingle(name) {
    // var data = fs.readFileSync("file.txt")
    // var read = data.toString()
    // var readData = JSON.parse(read)
    // readData.forEach(element => {
    //     if (element.name == name) {
    //         console.log("Name: " + element.name + "\nDescription: " + element.description + "\nStatus: " + element.status)
    //     }
    // })
}
function update(obj1) {
    var data = fs.readFileSync("file.txt")
    var read = data.toString()
    var readData = JSON.parse(read)
    var getIndex = readData.findIndex(x => x.id === obj1.id);
    if (getIndex != -1) {
        var obj = readData[getIndex];
        var result = validation_check(obj1)
        if (result.error) {
            return result.error.details[0].message
        }
        else {
            obj.courseTitle = obj1.courseTitle;
            obj.instructor = obj1.instructor;
            readData[getIndex] = obj;
            var newData = JSON.stringify(readData);
            fs.writeFileSync('file.txt', newData)
            return "Processed Ok"
        }
    }
    else {
        return "Could not find Course"
    }

}
function deleteSingle(id) {
    var data = fs.readFileSync("file.txt")
    var read = data.toString()
    var readData = JSON.parse(read)
    var getIndex = readData.findIndex(x => x.id === id);
    if (getIndex != -1) {
        readData.splice(getIndex, 1);
        var newData = JSON.stringify(readData);
        fs.writeFileSync('file.txt', newData)
        return "Processed Ok"
    }
    else {
        return "Could not find Course"
    }
}
module.exports = {
    writeNew,
    readAll,
    readSingle,
    update,
    deleteSingle
}