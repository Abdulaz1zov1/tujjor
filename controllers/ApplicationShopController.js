const Application = require("../models/applicationShop");

exports.create = (req, res) => {
    const application = new Application({
        name: req.body.name,
        user: req.user,
        phone: req.body.phone,
        email: req.body.email,
        companyName: req.body.companyName,
        comment: req.body.comment,
    });
    application
        .save()
        .then(() => {
            return res.status(200).json({ success: true, data: application });
        })
        .catch((err) => {
            return res.status(400).json({ success: false, err });
        });
};
exports.getAll = async (req, res) => {
    return res.status(200).json({ success: true, data: await Application.find() });
};
exports.getOne = async (req, res) => {
    await Application.findOne({ user: req.user })
        .select({ user: 0, __v: 0 })
        .then((data) => {
            return res.status(200).json({ success: true, data });
        })
        .catch((err) => {
            return res.status(500).json({ success: false, message: err });
        });
};
exports.editStatus = async (req, res) => {
    await Application.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: req.body.status } }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({ success: true });
    });
};
exports.delete = async (req, res) => {
    await Application.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true });
    });
};
