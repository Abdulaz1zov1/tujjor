const Tag = require("../models/tag");

exports.create = (req, res) => {
    const tag = new Tag({
        name: req.body.name,
    });
    tag.save()
        .then(() => {
            return res.status(200).json({ success: true, data: tag });
        })
        .catch((err) => {
            return res.status(400).json({ success: false, err });
        });
};
exports.all = async (req, res) => {
    Tag.find({}, (err, data) => {
        if (err) {
            res.status(500).json({ success: false, err });
        }
        res.status(200).json({ success: true, data });
    });
};
exports.delete = async (req, res) => {
    await Tag.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true });
    });
};
