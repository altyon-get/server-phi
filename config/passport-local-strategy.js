const passport = require('passport');
//passport use capital notations so thats why
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
}, function (email, password, done) {
    //find the user and establish identity
    User.findOne({ email: email }).then(function (user) {
        if(!user || user.password!=password){
            console.log('invalid username/pass');
            return done(null,false);
        }

        return done(null,user);
    })
}
));
//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});
//deserialing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id).then(function(user){
        return done(null,user);
    });
});

//whenever server restarts, authentication lost means session is temporarily saved
//check if user is authenticated
passport.checkAuthentication=function(req,res,next){
    //if the user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        console.log('authenticated');
        return next();
    } 
    //if the user in not sigend in
    console.log('not authenticated');
    return res.redirect('/users/signIn');
}
//to access authenticated user in views
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}
module.exports=passport;