const Message = require("../models/message");
exports.create = async (req, res) => {
    const message = new Message({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        message: req.body.message
    })
        
    message.save()
        .then((data) => {
            res.status(201).json({ success: true, data });
        })
        .catch((err) => {
            res.status(400).json({ success: false, err });
        });
};

exports.all = async (req, res) => {
    Message.find({}, { type: 0 }, (err, data) => {
        if (err) {
            res.status(500).json({ success: false, err });
        }
        res.status(200).json({ success: true, data });
    });
};
