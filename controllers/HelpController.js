const Help = require("../models/help");
const { getSlug } = require("../utils");

exports.create = (req, res) => {
    const help = new Help({
        title: {
            uz: req.body.title.uz,
            ru: req.body.title.ru,
        },
        description: {
            uz: req.body.description.uz,
            ru: req.body.description.ru,
        },
        status: req.body.status,
        slug: getSlug(req.body.title.ru),
    });
    help.save()
        .then(() => {
            return res.status(200).json({ success: true, data: help });
        })
        .catch((err) => {
            return res.status(400).json({ success: false, err });
        });
};
exports.getAll = async (req, res) => {
    return res.status(200).json({ success: true, data: await Help.find() });
};
exports.getOne = async (req, res) => {
    res.status(200).json({ success: true, data: await Help.findOne({ slug: req.params.slug }) });
};
exports.edit = async (req, res) => {
    await Help.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({ success: true });
    });
};
exports.delete = async (req, res) => {
    await Help.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true });
    });
};

exports.getClientAll = async (req, res) => {
    return res.status(200).json({ success: true, data: await Help.find({ status: true }) });
};
