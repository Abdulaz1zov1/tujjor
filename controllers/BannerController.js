const Banner = require("../models/banner");
const { deleteFile } = require("../utils");

exports.uploadImage = async (req, res) => {
    const { filename } = req.file;
    res.status(200).json({url: `/uploads/banners/${filename}`})
};
exports.create = (req, res) => {
    const banner = new Banner({
        image: req.body.image,
        url: req.body.url,
        position: req.body.position,
    });
    banner
        .save()
        .then((data) => {
            res.status(200).json({ success: true, data });
        })
        .catch((err) => {
            res.status(400).json({
                message: err.message || "Something went wrong while creating the banner.",
            });
        });
};
exports.getAllForAdmin = async (req, res) => {
    const redisText = "BANNER_ALL"
    Banner.find({},{__v: 0})
        .then((data) => {
            req.SET_ASYNC(redisText, JSON.stringify(data), 'EX', 60)
            res.status(200).json({ success: true, data });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message || "Something went wrong while retrieving banner.",
            });
        });
};
exports.getAll = async (req, res) => {
    const redisText = "BANNER_ALL"
    const reply = await req.GET_ASYNC(redisText)
    if(reply){
        return res.status(200).json({success: true, data: JSON.parse(reply)})
    }
    Banner.find({},{__v: 0})
        .then((data) => {
            req.SET_ASYNC(redisText, JSON.stringify(data), 'EX', 60)
            res.status(200).json({ success: true, data });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message || "Something went wrong while retrieving banner.",
            });
        });
};
exports.edit = async (req, res) => {
    await Banner.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
        .then((data) => {
            if (!data) {
                return res.status(404).json({
                    message: "Banner not found with id " + req.params.id,
                });
            }
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).json({
                    message: "Banner not found with id " + req.params.id,
                });
            }
            return res.status(500).json({
                message: "Something went wrong updating note with id " + req.params.id,
            });
        });
};
exports.delete = (req, res) => {
    Banner.findByIdAndRemove(req.params.id)
        .then((banner) => {
            if (!banner) {
                return res.status(404).json({
                    success: false,
                    message: "Banner not found with id " + req.params.id,
                });
            }
            deleteFile(`/public${banner.image}`);
            res.json({ message: "Banner deleted successfully!" });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).json({
                    success: false,
                    message: "Banner not found with id " + req.params.id,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Could not delete banner with id " + req.params.id,
            });
        });
};
