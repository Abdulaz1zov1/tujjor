const Brand = require("../models/brand");
const sharp = require("sharp");
const path = require("path");
const { getSlug, deleteFile } = require("../utils");
const { updateStatusByBrand } = require("../utils/preModel");
exports.create = async (req, res) => {
    const { filename } = req.file;
    await sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize(150, 150)
        .jpeg({
            quality: 60,
        })
        .toFile(
            path.join(path.dirname(__dirname) + `/public/uploads/brands/${filename}`),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
    const brand = new Brand({
        name: req.body.name,
        slug: getSlug(req.body.name),
        image: `/uploads/brands/${filename}`,
    });
    brand
        .save()
        .then(() => {
            return res.status(200).json({ success: true, data: brand });
        })
        .catch((err) => {
            deleteFile(`/public/uploads/brands/${filename}`);
            return res.status(400).json({ success: false, err });
        });
};
exports.getAllForAdmin = async (req, res) => {
    try {
        const redisText = `BRAND_ALL`
        const brand = await Brand.find({},{ name: 1, image: 1 })
        req.SET_ASYNC(redisText, JSON.stringify(brand), 'EX', 60)
        return res.status(200).json({ success: true, data: brand });
    } catch (error) {
        res.status(400).json({ success: false, error })
    }
};
exports.getAll = async (req, res) => {
    try {
        const redisText = `BRAND_ALL`
        const reply = await req.GET_ASYNC(redisText)
        if(reply){
            return res.status(200).json({success: true, data: JSON.parse(reply)})
        }
        const brand = await Brand.find({}, { name: 1, image: 1 })
        req.SET_ASYNC(redisText, JSON.stringify(brand), 'EX', 60)
        return res.status(200).json({ success: true, data: brand });
    } catch (error) {
        res.status(400).json({ success: false, error })
    }
};
exports.getOne = async (req, res) => {
    if (!req.params.slug) {
        return res.status(400).json({ success: false, data: [] });
    }
    res.status(200).json({
        success: true,
        data: await Brand.findOne({ slug: req.params.slug }),
    });
};
exports.edit = async (req, res) => {
    await Brand.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true },
        async (err, data) => {
            if (err) {
                return res.status(400).json({ success: false, err });
            }
            res.status(200).json({ success: true, data });
        }
    );
};
exports.editImage = async (req, res) => {
    const img = { image: `/uploads/brands/${req.file.filename}` };
    Brand.findByIdAndUpdate({ _id: req.params.id }, { $set: img }).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        deleteFile(`/public${data.image}`);
        return res.status(200).json({ success: true, data });
    });
};
exports.delete = async (req, res) => {
    await Brand.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        deleteFile(`/public${data.image}`);
        updateStatusByBrand(data._id);
        res.status(200).json({ success: true, data: [] });
        
    });
};
