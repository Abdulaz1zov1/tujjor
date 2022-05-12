const User = require("../models/user");
const Client = require("../models/client");
// const jwt = require("jsonwebtoken");
// const sharp = require("sharp");
// const path = require("path");
const bcrypt = require("bcrypt");
const { deleteFile } = require("../utils");
const SMS = require("../utils/sms");
const ApplicationShop = require("../models/applicationShop");
const Shop = require("../models/shop");

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
    });
};
exports.sendCode = async (req, res) => {
    const phone = req.body.phone;
    let client = await Client.findOne({phone: req.body.phone}) 
    let code = 0;
    for (let i = 0; code.toString().length !== 5; i++) {
        code = code*10 + Math.floor(Math.random()*10)
    }
    code = code.toString()
    if(!client) {
        const client = new Client({
            phone: req.body.phone,
            code: code
        });
        client.save().then(()=>{
            SMS(phone, code).then(()=>{
                    res.status(200).json({ success: true, message: "confirmation code sent!"})
                }).catch(e =>{
                    throw e
                })
        }).catch(()=>{
            res.status(500).json({ success: false, message: "Something went wrong"})
        })
    } else {
        Client.findByIdAndUpdate({ _id: client._id}, {$set: {code: code}}).then(()=>{
                SMS(phone, code).then(()=>{
                    res.status(200).json({ success: true, message: "confirmation code sent!"})
                }).catch(e =>{
                    throw e
                })
            }).catch(()=>{
                res.status(500).json({ success: false, message: "Something went wrong"})
            })
    }
}
exports.checkCode = async (req, res) => {
    const phone = req.body.phone;
    const code = req.body.code;
    const client = await Client.findOne({phone});
    if(code === client.code){
        sendTokenResponse(client, 200, res);
    } else {
        res.status(400).json({ success: false, message: "Code not equal"})
    }
}
exports.create = async (req, res) =>{
    const user = await User.findOne({phone: req.body.phone});
    if(user){
        res.status(409).json({ success: false, message: "User already exists"});
    } else {
        const salt = await bcrypt.genSalt(12);
        const pass = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            name: req.body.name,
            password: pass,
            phone: req.body.phone
        });
        await user
            .save()
            .then(() => {
                res.status(201).json({ success: true, phone: user.phone})
            })
            .catch((err) => {
                res.status(400).json({
                    success: false,
                    err,
                });
            });
    }
}
exports.loginAdmin = async (req, res) => {
    if (!req.body.phone || !req.body.password) {
        return res.status(400).json({
            success: false,
            data: "required",
        });
    }
    await User.findOne({ phone: req.body.phone }, (err, user) => {
        if (err) return res.send(err);
        if (!user || user.role != "admin") {
            return res.status(401).json({
                success: false,
                data: "phone or password wrong",
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                success: false,
                data: "phone or password wrong",
            });
        }
        sendTokenResponse(user, 200, res);
    });
};
exports.loginSeller = async (req, res) => {
    if (!req.body.phone || !req.body.password) {
        return res.status(400).json({
            success: false,
            data: "required",
        });
    }
    await User.findOne({ phone: req.body.phone }, (err, user) => {
        if (err) return res.send(err);
        if (!user || user.role != "seller") {
            return res.status(401).json({
                success: false,
                data: "phone or password wrong",
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                success: false,
                data: "phone or password wrong",
            });
        }
        sendTokenResponse(user, 200, res);
    });
};
// exports.login = async (req, res) => {
//     if (!req.body.phone || !req.body.password) {
//         return res.status(400).json({
//             success: false,
//             data: "required",
//         });
//     }
//     await User.findOne({ phone: req.body.phone }, (err, user) => {
//         if (err) return res.send(err);
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 data: "phone or password wrong",
//             });
//         }
//         if (!bcrypt.compareSync(req.body.password, user.password)) {
//             return res.status(401).json({
//                 success: false,
//                 data: "phone or password wrong",
//             });
//         }
//         if(user.isPhoneVerification){
//             sendTokenResponse(user, 200, res);
//         } else {
//             res.status(403).json({success: false, message: "Not activated!"})
//         }
//     });
// };
exports.getUsers = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const count = await User.countDocuments({});
    User.aggregate([
        {$project:{
            password: 0, 
            __v: 0
        }},
        {$sort: {createdAt: -1 }},
        {$skip: (page - 1) * limit},
        {$limit: limit},
    ]).exec((err, data)=>{
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({success: true, data, count})
    })

};
exports.clientMe = async (req, res) => {
    const application = await ApplicationShop.findOne({user: req.user});
    const shop = await Shop.findOne({user: req.user});
    await Client.findById({ _id: req.user })
        .select({ phone: 1, email: 1, name: 1, address: 1, image: 1})
        .exec(async (err, data) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({ 
                success: true, 
                data: {
                    _id: data._id,
                    phone: data.phone,
                    address: data.address,
                    application: (application && application.status) ? 1: 0,
                    shop: (shop && shop.status) ? 1: 0
                }});
        });
};
exports.me = async (req, res) => {
    await User.findById({ _id: req.user })
        .select({ phone: 1, email: 1, name: 1, address: 1, image: 1})
        .exec(async (err, data) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({ 
                success: true, 
                data: {
                    _id: data._id,
                    phone: data.phone,
                    email: data.email,
                    name: data.name
                }});
        });
};
exports.delete = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, data: "Somting is wrong" });
    }
    let result = await User.findByIdAndDelete({ _id: req.params.id });
    if (!result) {
        return res.status(400).json({ success: false, data: "This id not found" });
    }
    deleteFile(`/public${result.image}`);
    return res.status(200).json({ success: true, data: [] });
};
// exports.edit = async (req, res) => {
//     let filename, obj = req.body;

//     if(req.file){
//         filename = req.file.filename
//         sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
//         .resize(100, 100)
//         .toFile(
//             path.join(path.dirname(__dirname) + `/public/uploads/users/${filename}`),
//             (err) => {
//                 if (err) {
//                     console.log(err);
//                 }
//                 deleteFile(`/public/temp/${filename}`);
//             }
//         );
//         obj['image'] = `/uploads/users/${filename}`
//     }
//     if(obj.password || obj.role || obj.phone || obj.email){
//         return res.status(400).json({ success: false, message: "Something went wrong"})
//     }
//     User.findByIdAndUpdate({ _id: req.user }, { $set: obj }, { new: true , fields: { address: 1},}).exec((err, data) => {
//         if (err) {
//             return res.status(400).json({ success: false, err });
//         }
//         res.status(201).json({ success: true, data: data });
//     });
// };
exports.checkCodeResetPassword = async (req, res) => {
    const phone = req.body.phone;
    const code = req.body.code;
    const user = await User.findOne({phone});
    if(!user){
        return res.status(400).json({ success: false, message: "User not found!"})
    }
    if(code === user.code){
        const salt = await bcrypt.genSalt(3);
        const hash = await bcrypt.hash(`${phone}${code}`, salt)
        req.SET_ASYNC(`${phone}`, hash, 'Ex', 300)
        res.status(200).json({ success: true, data: {hash, phone}})
    } else {
        res.status(400).json({ success: false, message: "Code not equal"})
    }
}
exports.resetPassword = async (req, res) => {
    const phone = req.body.phone;
    const reply = await req.GET_ASYNC(`${phone}`)
    if(!(req.body.password && req.body.password.length)){
        return res.status(400).json({ success: false, message: "Minimum of 8 character"})
    }
    if(reply){
        if(req.body.hash === reply){
            const salt = await bcrypt.genSalt(12);
            const pass = await bcrypt.hash(req.body.password, salt);
            User.findOneAndUpdate({phone}, {$set: {password: pass}}, {new: true}).then(()=>{
                res.status(200).json({ success: true, message: "Password changed successfully"})                
            }).catch(err=>{
                console.log(err)
                res.status(500).json({ success: false, message: "Something went wrong"})
            })
        } else {
            res.status(400).json({ success: false, message: "Hash value not equal"})
        }
    } else {
        res.status(400).json({ success: false, message: "User not found or Timeout"})
    }
};
