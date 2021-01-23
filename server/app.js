require("dotenv").config();
let express = require('express');
let app = express();
const sequelize = require("./db");

let journal = require('./controllers/journalcontroller')
let user = require('./controllers/usercontroller')
let calc = require('./controllers/calculatorcontroller')
//importing the module from journalcontroller.js

sequelize.sync();

app.use(require('./middleware/headers'));
app.use(express.json());
//EXPOSED ROUTE
app.use('/user', user);
//PROTECTED ROUTE
// app.use(require('./middleware/validate-session'));
//This would make everything below restricted, which we don't want
app.use('/journal', journal)
app.use("/calculator", calc);

app.listen(3000, function(){
    console.log('App is listening on port 3000');
})

