const Info = require("../models/info");
const { getSlug } = require("../utils");

exports.create = (req, res) => {
    const info = new Info({
        title: {
            uz: req.body.title.uz || "",
            ru: req.body.title.ru || "",
        },
        description: {
            uz: req.body.description.uz || "",
            ru: req.body.description.ru || "",
        },
        status: req.body.status,
        slug: getSlug(req.body.title.ru),
    });
    info.save()
        .then(() => {
            return res.status(200).json({ success: true, data: info });
        })
        .catch((err) => {
            return res.status(400).json({ success: false, err });
        });
};
exports.getAll = async (req, res) => {
    return res.status(200).json({ success: true, data: await Info.find() });
};
exports.getOne = async (req, res) => {
    res.status(200).json({
        success: true,
        data: await Info.findOne({ slug: req.params.slug }),
    });
};
exports.edit = async (req, res) => {
    await Info.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({ success: true });
    });
};
exports.delete = async (req, res) => {
    await Info.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true });
    });
};

exports.getClientAll = async (req, res) => {
    return res.status(200).json({ success: true, data: await Info.find({ status: true }) });
};
