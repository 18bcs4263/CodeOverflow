const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/user.model');

require('dotenv').config();
const SECURITY_KEY = process.env.SECURITY_KEY;

const generateToken = () => {
    const randomToken = require('random-token').create(SECURITY_KEY);
    return randomToken(50);
}

router.post('/get_all_users', jsonParser, (req, res) => {
    if (!req.body.key) res.status(403).json("Permission denied.")
    else {
        const key = req.body.key;
        if (key !== SECURITY_KEY) res.status(403).json("Permission denied.")
        else {
            User.find({})
                .then(users => {
                    let name = []
                    users.forEach(user => {
                        name.push(user.email)
                    })
                    res.json(name);
                })
                .catch(err => res.status(500).json("Error: " + err));
        }
    }
})

function sortUsersBasedOnSkills(reqSkills, users, token) {
    var results = []
    users.forEach(
        user => {
                user.match = 0;
                var prevSize = user.skills.length + reqSkills.length;
                user.skills = [...new Set([...user.skills, ...reqSkills])];
                user.match = prevSize - user.skills.length;
                var dao = {};
                dao.name = user.name;
                dao.skills = user.skills;
                dao.email = user.email;
                dao.match = user.match;
                dao.description = user.description;
                console.log("Tokens" + user.token + token)
                if((dao.match>0 || reqSkills.length == 0) && user.token != token)
                    results.push(dao);
        }
    )
    // results = results.sort(function (a, b) {
    //     if (a.match > b.match) {
    //         return -1;
    //     } else if (a.match < b.match) {
    //         return 1;
    //     }
    //     return 0;
    // })
    console.log(results)
    return results
}

router.post('/get_matching_users', jsonParser, (req, res) => {
    console.log(req.body)
    if (!req.body.key) res.status(403).json("Permission denied.")
    else {
        const key = req.body.key;
        const currentToken = req.body.token
        if (key !== SECURITY_KEY) res.status(403).json("Permission denied.")
        else {
            const reqSkills = JSON.parse(req.body.skills)
            const searchString = req.body.query
            if(searchString != null) {
                User.find({$text : {$search : searchString}}).then(allUsers => {
                    var users = allUsers
                    var results = sortUsersBasedOnSkills(reqSkills,allUsers,req.body.token)
                    res.json(results)
                }
                )
            } else {
                User.find({}).then(allUsers => {
                    var users = allUsers
                    
                    var results = sortUsersBasedOnSkills(reqSkills,allUsers,req.body.token)
                    res.json(results)
                }
                )
            }
            
        }
    }
})

router.post('/get_by_token/', (req, res) => {
    const key = req.body.SECURITY_KEY;
    if (key != SECURITY_KEY) res.status(403).json("Permission denied.")
    else {
        User.findOne({ token: req.body.token }, (err, user) => {
            if (err) res.status(500).json("Error: " + err);
            else if (!user) res.status(404).json("User not found.")
            else {
                user.token = generateToken();
                user.save()
                    .then(() => res.json(user))
                    .catch(err => res.status(500).json("Error: " + err));
            }
        })
    }
})

function getUserById(id) {
    User.findById(id)
        .then(user => {
            return user
        })
        .catch(err => res.status(500).json("Error: " + err));
}

router.post('/get_by_id/', (req, res) => {
    console.log(req.body)
    if (!req.body.key) res.status(403).json("Permission denied.")
    else {
        const key = req.body.key;
        if (key != SECURITY_KEY) res.status(403).json("Permission denied.")
        User.findById(req.body.id)
            .then(user => res.json(user))
            .catch(err => res.status(500).json("Error: " + err));
    }
})

router.post('/register', jsonParser, (req, res) => {
    const { name, password, description, email } = req.body;
    console.log("BODY" + name + email + req.body.skills)
    const skills = JSON.parse(req.body.skills)
    console.log("Skills" + skills)
    User.findOne({ email }, (err, user) => {
        if (err) res.status(500).json("Error has occured. Please refresh page")
        else if (user) res.status(400).json("Email has been token.")
        else {
            const token = generateToken();
            const newUser = new User({ name, password, email, description, token, skills });
            newUser.save()
                .then(() => {
                    res.json({ "Message": "Success", token });
                })
                .catch(err => res.status(500).json(err));
        }
    })
}
)

router.post('/login', jsonParser, (req, res) => {
    const { email, password } = req.body;
    console.log("Entered " + email + " " + password)
    User.findOne({ email }, (err, user) => {
        if (err) res.status(500).json("Error has occured.");
        else if (!user) res.status(400).json("User not found");
        else {
            user.comparePassword(password, (err, isMatch) => {
                if (err) res.status(500).json("Error is occured.")
                if (isMatch) {
                    const token = generateToken();
                    user.token = token;
                    user.save();
                    res.json({ "message": "Success", token });
                }
                else res.status(400).json("Password doesn't match")
            })
        }
    })
})

router.post('/update', jsonParser, (req, res) => {
    const token = req.body.token;
    if (!token) res.status(403).json("Permission denied.")
    else {
        User.findOne({ token: token, email: req.body.email }, (err, user) => {
            if (err) res.status(500).json("Something went wrong.")
            else if (!user) res.status(404).json("User not found.")
            else {
                const token = generateToken();
                user.token = token;
                user.email = req.body.new_email;
                user.name = req.body.name;
                user.save()
                    .then(() => res.json({ message: "Updated", user }))
                    .catch(err => res.status(500).json(err));
            }
        })
    }
})

module.exports = router;