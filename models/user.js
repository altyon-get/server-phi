const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        required: true
    },
    name:{
        type: String,
        required:true,
    },
    city:{
        type: String,
        required:true,
    },
    level1:{
        score:{
            type:Number,
            required:true,
        },
        locked:{    
            type:Boolean,
            required:true,
        }
    },
    level2:{
        score:{
            type:Number,
        },
        locked:{
            type:Boolean,
        }
    },
    level3:{
        score:{
            type:Number,
        },
        locked:{
            type:Boolean,
        }
    },
    level4:{
        score:{
            type:Number,
        },
        locked:{
            type:Boolean,
        }
    },
    level5:{
        score:{
            type:Number,
        },
        locked:{
            type:Boolean,
        }
    },
},{
    timestamps:true,
});

const User=mongoose.model('User',userSchema);
module.exports=User;