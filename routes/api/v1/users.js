const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersApi = require('../../../controllers/api/v1/users_api');


router.post('/create', usersApi.create);    
router.post('/create-session', usersApi.createSession);
router.get('/getUserData',passport.authenticate('jwt', {session: false}) ,usersApi.getUserData);
router.get('/getUsers' ,usersApi.getUsers);
router.post('/updateUser/:l' ,passport.authenticate('jwt', {session: false}),usersApi.updateUser);

module.exports = router;