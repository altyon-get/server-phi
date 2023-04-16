const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const admin = require('../../../admin');

module.exports.createSession = async function (req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });
        console.log(req.body,'ye login kr rha');
        if (!user || user.password != req.body.password) {
            return res.json(422, {
                message: "Invalid username or password"
            });
        }
        if (req.body.isAdmin==true) {
            console.log('imhere')
            console.log(admin.email)
            if (user.email == admin.email) {
                console.log(req.body,'admin login hogya');
                return res.json(200, {
                    message: 'Sign in successful, here is your token, please keep it safe!',
                    data: {
                        token: jwt.sign(user.toJSON(),process.env.SECRET , { expiresIn: '10000000' })
                    }
                })
            }
            
            console.log(req.body,'nhi hua');
            return res.json(422, {
                message: "Admin nhi ho bhai"
            });
        }
        console.log(req.body,'normal login hogya');
        return res.json(200, {
            message: 'Sign in successful, here is your token, please keep it safe!',
            data: {
                token: jwt.sign(user.toJSON(), process.env.SECRET, { expiresIn: '10000000' })
            }
        })

    } catch (err) {
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}
module.exports.create = function async(req, res) {
    if (req.body.password != req.body.cpassword) {
        console.log('password mismatch');
        return res.json(422, {
            message: 'Password mismatch',
        });
    }
    async function getItems() {
        const Items = await User.findOne({ email: req.body.email });
        return Items;
    }

    getItems().then(
        function (user, err) {
            if (user) {
                console.log('alredy register');
                return res.json(422, {
                    message: 'alredy register',
                });
            }
            if (err) {
                console.log(err, 'ye h err');
                return res.json(500, {
                    message: 'Internal Server Error',
                });
            }
            else {
                // req.body.level1.unlock=false;
                // req.body.level1.score=0;
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    level1: { score: 0, locked: true },
                    level2: { score: 0, locked: true },
                    level3: { score: 0, locked: true },
                    level4: { score: 0, locked: true },
                    isAdmin:false,
                });
                console.log('succefully created');
                return res.json(200, {
                    message: 'succefully created',
                });
            }
        });
    // console.log(req.body);
    // return res.end('ok');
};
module.exports.getUserData = async function (req, res) {
    console.log('req ayi');
    try {
        let user = await User.findById(req.user.id);
        const x=(user.email==process.env.ADMIN);
        console.log(x);
        if (user) {
            console.log('1 REQ data le gyi:', user.level3);
            return res.json(200, {
                message: "Usre Found!",
                user: user,
                isAdmin: x
            });
        } else {
            return res.json(401, {
                message: "No user Found"
            });
        }

    } catch (err) {
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}
module.exports.getUsers = async function (req, res) {
    let users = await User.find({}).sort('-score');
    let data = [];
    users.map((user) => {
        data.push({
            name: user.name,
            score: user.level1.score
        }
        );
    })
    return res.json(200, {
        message: "List of users",
        users: data,
    })
}
module.exports.updateUser = async function (req, res) {
    try {
        console.log(req.params.l, '-level UpDT REQ AYI H:', req.body);
        // console.log(req.params.id);
        const _level = `level${req.params.l}`;
        let currUser = await User.findById(req.user.id);
        console.log(currUser[_level], '- curr data h',);

        if (currUser[_level].locked) {
            console.log('lock updated');
            let user = await User.findOneAndUpdate(
                { _id: req.user.id },
                { [_level]: { score: currUser[_level].score, locked: req.body.locked } },
            );
            if (user) return res.json(200, { message: "Updated lock!", user: user });
            else return res.json(401, { message: "No user Found" });
        }
        else if (currUser[_level].score == 0) {
            console.log('unlocked already h, lock updt nhi kiye');
            console.log('score updated');
            let user = await User.findOneAndUpdate(
                { _id: req.user.id },
                { [_level]: { score: req.body.score, locked: currUser[_level].locked } },
            );
            if (user) return res.json(200, { message: "Updated score!", user: user });
            else return res.json(401, { message: "No user Found" });
        }
        else {
            console.log('sb updated h, kch updt nhi kiye');
            console.log(currUser[_level]);
            return res.json(200, { message: 'no chng req' });
        }

    } catch (err) {
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}


