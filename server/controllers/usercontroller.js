// let express = require('express');
//import the express framework and store it inside the variable express. This instance becomes our gateway to using express methods

// let router = express.Router();
//create a new variable, and use the express.Router() property we gained access to by calling express - it will return a router object for us

// let sequelize = require('../db')
// let User = sequelize.import('../models/user.js')

const router = require('express').Router();
const User = require('../db').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/create', function(req, res) {

    User.create({
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 13)
    })
    .then(
        function createSuccess(user) {
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24});

            res.json({
                user: user,
                message: "User successfully created!",
                sessionToken: token
            });
        }
    )
    .catch(err => res.status(500).json({ error: err }))

});

// router.post('/login', function (req, res){
//     User.findOne({
//         where: {
//             username: req.body.user.username
//         }
//     })
//     .then(function loginSuccess(user) {
//         if (user) {
//         res.status(200).json({
//             user: user
//         })
//     } else {
//         res.status(500).json({ error: 'User does not exist.'})
//     }
//     })
//     .catch(err => res.status(500).json({ error: err }))
// });


//.findOne is a sequelize method, finds first entry that matches, since email must be unique that's ok. it's a promise because it may take some time to go to database, look, and respond
router.post('/login', function(req, res) {
    User.findOne({
        where: {
            email: req.body.user.email
            //req from parameters, body like body we type in postman, object user, object email
        }
    })
    .then (function loginSuccess(user){
        if(user){
            bcrypt.compare(req.body.user.password, user.password, function (err, matches) {
                if (matches) {

                    let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24})

                    res.status(200).json({
                        user : user,
                        message: "User successfully logged in!",
                        sessionToken: token
                    })

                } else {
                    res.status(502).send({ error: "Login Failed" });
                }
            });
        } else {
            res.status(500).json({ error: "User does not exist." })
        }
        }) 
        .catch(function (err) {
        res.status(500).json({ error: err});
    });

});

//end my attempt


module.exports = router;