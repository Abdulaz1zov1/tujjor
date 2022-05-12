const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Client = require("../models/client");
exports.protectUser = async (req, res, next) => {
    let token;
    if (req.headers.token && req.headers.token.startsWith("Bearer")) {
        token = req.headers.token.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            data: "No authorize to access this route",
        });
    }
    try {
        //  verify token
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id);
        if (!!user) {
            req.user = user._id;
            next();
        } else {
            return res.status(401).json({
                success: false,
                data: "No authorize to access this route",
            });
        }
    } catch (err) {
        return res.status(401).json({
            success: false,
            data: "No authorize to access this route",
        });
    }
};
exports.protectClient = async (req, res, next) => {
    let token;
    if (req.headers.token && req.headers.token.startsWith("Bearer")) {
        token = req.headers.token.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            data: "No authorize to access this route",
        });
    }
    try {
        //  verify token
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        let client = await Client.findById(decoded.id);
        if (!!client) {
            req.user = client._id;
            next();
        } else {
            return res.status(401).json({
                success: false,
                data: "No authorize to access this route",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            data: "No authorize to access this route",
        });
    }
};
exports.protectAdmin = async (req, res, next) => {
    let token;
    if (req.headers.token && req.headers.token.startsWith("Bearer")) {
        token = req.headers.token.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            data: "No authorize to access this route",
        });
    }
    try {
        //  verify token
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id);
        if (user.role != "admin") {
            return res.status(401).json({
                success: false,
                data: "No authorize to access this route",
            });
        }
        req.user = user._id;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            data: "No authorize to access this route",
        });
    }
};
exports.protectSeller = async (req, res, next) => {
    let token;
    if (req.headers.token && req.headers.token.startsWith("Bearer")) {
        token = req.headers.token.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            data: "No authorize to access this route",
        });
    }
    try {
        //  verify token
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id);
        if (user.role != "seller") {
            return res.status(401).json({
                success: false,
                data: "No authorize to access this route",
            });
        }
        req.user = user._id;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            data: "No authorize to access this route",
        });
    }
};
exports.protectAuthOrder = async (req, res, next) => {
    let token;
    const phone = req.body.address ? req.body.address.phone : null;
    if(!phone){
        return res.status(400).json({message: "Invalid phone number"});
    }
    if (req.headers.token && req.headers.token.startsWith("Bearer")) {
        token = req.headers.token.split(" ")[1];
    }
    if (!token) {
        return createAndCheck(req, next, phone)
    }
    try {
        //  verify token
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        let client = await Client.findById(decoded.id);
        if (!!client) {
            req.user = client._id;
            next();
        } else {
            return createAndCheck(req, next, phone)
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err?.message,
        });
    }
}
async function createAndCheck(req, next, phone){
    const result = await Client.findOne({phone});
    if(result){
        req.user = result._id;
        next();
    } else {
        const client = new Client({phone});
        client.save().then(() => {
            req.user = client._id;
            next();
        })
    }
}