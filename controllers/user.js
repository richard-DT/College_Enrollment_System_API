const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require("../auth");
const { errorHandler } = auth;





module.exports.checkEmailExists = (req, res) => {

    if (req.body.email.includes("@")){

        return User.find({ email : req.body.email })
        .then(result => {

            if (result.length > 0) {

                return res.status(409).send({message: 'Duplicate email found'});

            } else {

                return res.status(200).send({message: 'No duplicate email found'});
            };
        })
        .catch(err => errorHandler(err, req, res))

    } else {
        return res.status(400).send({message: 'Invalid email format'});
    }   
};


module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")){
        return res.status(400).send({ message: 'Invalid email format' });
    } else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ message: 'Mobile number is invalid' });
    } else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password muse be atleast 8 characters long' });
    // If all needed requirements are achieved
    } else {

        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({
            success: true,
            message: "User registeredd successfully",
            user: result
        }))
        .catch(error => errorHandler(error, req, res));
        
    }
};

module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")){

        return User.findOne({ email : req.body.email })
        .then(result => {

            if(result == null){

                return res.status(404).send({ message: 'No email found'});

            } else {

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                if (isPasswordCorrect) {

                    const accessToken = auth.createAccessToken(result);

                    return res.status(200).send({ message: 'User logged in successfully',
                        access: accessToken

                        });
               
                } else {

                    return res.status(401).send({ message: 'Incorrect email or password'});

                }
            }
        })
        .catch(err => errorHandler(err, req, res))
    } else {
        return res.status(400).send({ message: 'Invalid email format'});
    }  
};

/*module.exports.getProfile = (req, res) => {

    return User.findById(req.user.id)
    .then(user => {
        user.password = "";
        return res.status(200).send(user)
    })
    .catch(err => errorHandler(err, req, res))
};*/

// for improvement sa part na 'User not found'
module.exports.getProfile = (req, res) => {

    User.findById(req.user.id)
    .then(user => {

        if(user)  {
            user.password = "";
            return res.status(200).send(user);
            
        } else {

            return res.status(404).send({ message: 'User not found'});

        }

    })
    .catch(err => errorHandler(err, req, res))
};