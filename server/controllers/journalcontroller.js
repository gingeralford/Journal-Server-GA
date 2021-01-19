let express = require('express');
//import the express framework and store it inside the variable express. This instance becomes our gateway to using express methods

let router = express.Router();
//create a new variable, and use the express.Router() property we gained access to by calling express - it will return a router object for us
let validateSession = require("../middleware/validate-session");

const Journal = require('../db').import('../models/journal');

// const router = require('./calculatorcontroller'); Challenge stuff, unneeded

//injecting the validate-session.js code as a middleware function, it will check to see if there is a token for this route. This is good for when just a specific number of routes need to be restricted. 
router.get('/practice', validateSession, function(req, res) {
    res.send('Hey!! This is a practice route!')
})

router.post('/create', validateSession, (req, res) => {
    const journalEntry = {
        title: req.body.journal.title,
        date: req.body.journal.date,
        entry: req.body.journal.entry,
        owner: req.user.id
    }
    Journal.create(journalEntry)
        .then(journal => res.status(200).json(journal))
        .catch(err => res.status(500).json({ error: err}))
});

//GET ALL ENTRIES
router.get('/', (req, res) => {
    Journal.findAll()
        .then(journals => res.status(200).json(journals))
        .catch(err => res.status(500).json({ error: err }))
});

//GET ENTRIES BY USER
router.get('/mine', validateSession, (req, res) => {
    let userid = req.user.id
    Journal.findAll({
        where: ( {owner: userid} )
    })
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json( { error: err}))
});

//GET ENTRIES BY TITLE
router.get('/:title', function (req, res) {
    //:title is Dynamic...it grabs the title from the params of the request, specifically from the url sent in postman
    let title = req.params.title;

    Journal.findAll({
        where: { title : title }
    })
    .then(journals => res.status(200).json(journals))
    .catch(err => req.status(500).json({ error: err }))
});

router.put("/update/:entryId", validateSession, function (req, res) {
    //missing something here maybe?
    // let entryId = req.params.id;
    const updateJournalEntry = {
        title: req.body.journal.title,
        date: req.body.journal.date,
        entry: req.body.journal.entry
    };

    const query = { where: { id: req.params.entryId, owner: req.user.id } };

    Journal.update(updateJournalEntry, query)
        .then((journals) => res.status(200).json(journals))
        .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/delete/:id", validateSession, function (req, res) {
    const query = { where: { id: req.params.id, owner: req.user.id } };

    Journal.destroy(query) //basically builds a SQL query to search for item
        .then(() => res.status(200).json({ message: "Journal Entry Removed" }))
        .catch((err) => res.status(500).json( { error: err }));
});

// router.get('/about', function(req, res) {
//     res.send("This is the about route")
// })
//uses .get() method inside of Router() property which allows to complete HTTP GET request. /practice is our path, then a callback function that uses .send() express method to send something back

module.exports = router;
//export the module for usage outside of the file