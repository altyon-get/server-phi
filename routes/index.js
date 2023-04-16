const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{res.end('home page');});
router.use('/users',require('./users'));
router.use('/api', require('./api'));

module.exports = router;