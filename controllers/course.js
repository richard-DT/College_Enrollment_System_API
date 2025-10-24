const Course = require("../models/Course");
const { errorHandler } = require('../auth');


module.exports.addCourse = (req, res) => {

    let newCourse = new Course({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    Course.findOne({ name: req.body.name })
    .then(existingCourse => {
        if(existingCourse){
            // using res.send({ key: value}) is a common and appropriate way to
            // structure a response from an API to the client.
            // Direct string will only cause an error when connecting it to your frontend.
            return res.status(409).send({ message: "Course already exist"});
        } else {
           return newCourse.save()
           .then(result => res.status(201).send({
                success: true,
                message: 'Course added successfully',
                result: result
           }))
           .catch(err => errorHandler(err, req, res)) 
        }
    })
    .catch(err => errorHandler(err, req, res))
}; 


module.exports.getAllCourses = (req, res) => {

    return Course.find({})
    .then(result => {

        if(result.length > 0) {

            return res.status(200).send(result);

        } else {

            return res.status(404).send({message: 'No courses found'});
        }
    })
    .catch(error => errorHandler(error, req, res));

};

module.exports.getAllActive = (req, res) => {

    Course.find({ isActive: true })
    .then(result => {

        if (result.length > 0) {

            return res.status(200).send(result);

        } else {

            return res.status(404).send({message: 'No active courses found'})
        }
    })
    .catch(error => errorHandler(error, req, res));

};

module.exports.getCourse = (req, res) => {
    Course.findById(req.params.id)
    .then(course => {
        if(course) {

            return res.status(200).send(course);

        } else {

            return res.status(404).send({message: 'Course not found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
    
};

module.exports.updateCourse = (req, res)=>{

    let updatedCourse = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Course.findByIdAndUpdate(req.params.courseId, updatedCourse)
    .then(course => {
        if (course) {
            return res.status(200).send({
                success: true,
                message: 'Course updated successfully'
            });
        } else {
            return res.status(500).send({message: 'Course not found'});
        }
    })
    .catch(error => {
        return res.status(404).send({message: 'Course not found'});
        //errorHandler(error, req, res)
    });
};

module.exports.archiveCourse = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
    .then(course => {
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        if (!course.isActive) {
            return res.status(200).send({
                message: 'Course already archived',
                course
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Course archived successfully'
        });
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.activateCourse = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    
    return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
    .then(course => {
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        if (course.isActive) {
            return res.status(200).send({
                message: 'Course already activated',
                course
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Course activated successfully'
        });
    })
    .catch(error => errorHandler(error, req, res));
};


