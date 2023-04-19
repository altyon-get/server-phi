const User = require('../../../models/user');
const jwt = require('jsonwebtoken');


module.exports.createSession = async function (req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });
        console.log(req.body, 'ye login kr rha');
        if (!user || user.password != req.body.password) {
            return res.json(422, {
                message: "Invalid username or password"
            });
        }
        return res.json(200, {
            message: 'Sign in successful!',
            data: {
                token: jwt.sign(user.toJSON(), process.env.SECRET, { expiresIn: '10000000' })
            }
        });

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
                    city: req.body.city,
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
        // const x = (user.email == process.env.ADMIN);
        // console.log(x,' : admin h');
        if (user) {
            return res.json(200, {
                message: "Usre Found!",
                user: user,
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
    let users = await User.find({});
    let data=[];
    users.map((user) => {
        if (!user.isAdmin) {
            data.push({
                name: user.name,
                city: user.city,
                score: user.level1.score + user.level2.score + user.level3.score + user.level4.score,
                level1:user.level1,
                level2:user.level2,
                level3:user.level3,
                level4:user.level4,
            }
            );
        }
    })
    console.log('req list of user legyi');
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


