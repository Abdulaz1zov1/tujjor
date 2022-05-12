const Slider = require("../models/slider");
const sharp = require("sharp");
const path = require("path");
const { deleteFile } = require("../utils");

exports.create = async (req, res) => {
    const slider = new Slider({
        image: req.body.image,
        url: req.body.url
    });
    slider
        .save()
        .then((data) => {
            res.status(200).json({ success: true, data });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message || "Something went wrong while creating the slider.",
            });
        });
};
exports.getAllForAdmin = async (req, res)=>{
    const redisText = "SLIDER_ALL"
    Slider.find({},{__v: 0})
    .then((data) => {
        req.SET_ASYNC(redisText, JSON.stringify(data), 'EX', 60)
        res.status(200).json({ success: true, data });
    })
    .catch((err) => {
        res.status(500).json({
            message: err.message || "Something went wrong while retrieving slider.",
        });
    });
}
exports.getAll = async (req, res) => {
    const redisText = "SLIDER_ALL"
    const reply = await req.GET_ASYNC(redisText)
    if(reply){
        return res.status(200).json({success: true, data: JSON.parse(reply)})
    }
    Slider.find({},{__v: 0})
    .then((data) => {
        req.SET_ASYNC(redisText, JSON.stringify(data), 'EX', 60)
        res.status(200).json({ success: true, data });
    })
    .catch((err) => {
        res.status(500).json({
            message: err.message || "Something went wrong while retrieving slider.",
        });
    });
};
exports.edit = async (req, res) => {
    await Slider.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
        .then((data) => {
            if (!data) {
                return res.status(404).json({
                    message: "Slider not found with id " + req.params.id,
                });
            }
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).json({
                    message: "Slider not found with id " + req.params.id,
                });
            }
            return res.status(500).json({
                message: "Something went wrong updating note with id " + req.params.id,
            });
        });
};

exports.uploadImage = async (req, res) => {
    const { filename } = req.file;
    await sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .jpeg({
            quality: 70,
        })
        .toFile(path.join(path.dirname(__dirname) + `/public/uploads/sliders/${filename}`), (err) => {
            if (err) {
                console.log(err);
            }
            deleteFile(`/public/temp/${filename}`);
        });
    res.status(200).json({url: `/uploads/sliders/${filename}`})
};
exports.delete = (req, res) => {
    Slider.findByIdAndRemove(req.params.id)
        .then((slider) => {
            if (!slider) {
                return res.status(404).json({
                    success: false,
                    message: "Slider not found with id " + req.params.id,
                });
            }
            deleteFile(`/public${slider.image}`);
            res.json({ message: "Slider deleted successfully!" });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).json({
                    success: false,
                    message: "Slider not found with id " + req.params.id,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Could not delete slider with id " + req.params.id,
            });
        });
};
