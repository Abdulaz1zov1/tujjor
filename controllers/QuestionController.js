const Question = require("../models/question");
const { getSlug } = require("../utils");

exports.create = (req, res) => {
    const help = new Question({
        name: req.body.name,
        email: req.body.email,
        question: req.body.question,
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
    return res.status(200).json({ success: true, data: await Question.find() });
};
exports.delete = async (req, res) => {
    await Question.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true, data: [] });
    });
};
