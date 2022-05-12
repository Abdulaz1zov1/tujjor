const Region = require("../models/regions");
const District = require("../models/district");

exports.addRegion = (req, res) => {
    const region = new Region(req.body);
    region
        .save()
        .then(() => {
            res.status(201).json({ success: true, data: region });
        })
        .catch((err) => {
            res.status(400).json({ success: false, err });
        });
};
exports.editRegion = async (req, res) => {
    await Region.updateOne({ _id: req.params.id }, { $set: req.body }).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: false, data });
    });
};
exports.deleteRegion = async (req, res) => {
    await Region.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: [] });
};
exports.getRegionsForAdmin = async (req, res) => {
    const redisText = "REGION_ALL"
    await Region.aggregate([
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: "districts",
                localField: "_id",
                foreignField: "region",
                as: "districts",
            },
        },
    ]).exec((err, data) => {
        if (err)
            return res.status(400).json({
                success: false,
                err,
            });
        req.SET_ASYNC(redisText, JSON.stringify(data), 'EX', 60)
        res.status(200).json({ success: true, data });
    });
}
exports.getRegions = async (req, res) => {
    const redisText = "REGION_ALL"
    const reply = await req.GET_ASYNC(redisText)
    if(reply){
        return res.status(200).json({success: true, data: JSON.parse(reply)})
    }
    await Region.aggregate([
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: "districts",
                localField: "_id",
                foreignField: "region",
                as: "districts",
            },
        },
    ]).exec((err, data) => {
        if (err)
            return res.status(400).json({
                success: false,
                err,
            });
        req.SET_ASYNC(redisText, JSON.stringify(data), 'EX', 60)
        res.status(200).json({ success: true, data });
    });
};

exports.addDistrict = (req, res) => {
    const district = new District(req.body);
    district
        .save()
        .then(() => {
            res.status(201).json({ success: true, data: district });
        })
        .catch((err) => {
            res.status(400).json({ success: false, err });
        });
};
exports.updateDistrict = async (req, res) => {
    await District.updateOne({ _id: req.params.id }, { $set: req.body }).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: false, data });
    });
};
exports.deleteDistrict = async (req, res) => {
    await District.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: [] });
};
