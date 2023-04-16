const dotenv=require('dotenv').config();

const express=require('express');
const cookieParser=require('cookie-parser');
//to create session for authorization,passport don't do this
const session=require('express-session');
//for authorization
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
//to store session permanently
const MongoStore=require('connect-mongo');
const cors = require('cors');


const db=require('./config/mongoose');
const app=express();
const port=process.env.PORT || 5000; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//set up the views
app.set('view engine','ejs');
app.set('views','./views'   );



//mongo store is used to store the session cookie in the db
app.use(session({
    //try chng the name what happens
    name:'phi',
    //Todo chng secret before deploy in production mode 
    secret: process.env.SECRET,
    //whenever there is request which is not intialized means,
    //session/identity not established then do i want to save extra data in the session cookie
    saveUninitialized: false,
    //session/identity established then do i want to resave the same data, if not chnged
    resave:false,
    cookie:{
        maxAge: (1000*60*1),
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}))
app.use(passport.initialize());
app.use(passport.session()); 
app.use(passport.setAuthenticatedUser);


app.use('/',require('./routes/index'));
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
});