let express = require('express');
const router = require('./journalcontroller');

router.post('/add', function(req, res){
    let number1 = req.body.num1;
    let number2 = req.body.num2;
    let obj = {total: number1 + number2}
    res.json(obj);
    
})



module.exports = router; //stops this from exporting