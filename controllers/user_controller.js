const User = require('../models/user');

module.exports.signIn = function (req, res) {
    return res.render('user_sign_in',{
        title: 'ojha'
    });
};
module.exports.signUp = function (req, res) {
    return res.render('user_sign_up',{
        title: 'ojha'
    });
};

//get the sign up data:
module.exports.create = function async(req, res) {
    if(req.body.password!=req.body.cpassword){
        console.log('password mismatch');
        return res.redirect('back');
    }
    async function getItems() {
        const Items = await User.findOne({ email: req.body.email });
        return Items;
    }

    getItems().then(
        function (user, err) {
            // console.log(err);
            // console.log(user);
            if (user) { console.log('alredy register'); return res.end('already registered'); }
            if (err) { console.log(err, 'ye h'); return res.end('error') }
            else {  
                User.create(req.body);
                console.log('succefully created');
                return res.redirect('/users/sign-in');
            }
        });
    // console.log(req.body);
    // return res.end('ok');
};

//sign in and create session for the user
module.exports.createSession=function(req,res){
    return res.redirect('/');
};
module.exports.destroySession=function(req,res){
    //passwords gives this function to req
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}
