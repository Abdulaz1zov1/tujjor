const Like = require("../models/like");
const mongoose = require("mongoose");
exports.create = (req, res) => {
    const like = new Like({
        product: req.body.product,
        user: req.user,
    });
    like.save()
        .then(() => {
            return res.status(200).json({ success: true, data: like });
        })
        .catch((err) => {
            return res.status(400).json({ success: false, err });
        });
};
exports.getAll = async (req, res) => {
    Like.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user) } },
        {
            $lookup: {
                from: "sizes",
                let: { productId: "$product" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$productId", "$$productId"] },
                        },
                    },
                    { $sort: { price: 1 } },
                    { $project: { price: 1, _id: 0, discount: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $gte: ["$discount_end", new Date()] },
                                        { $lte: ["$discount_start", new Date()] },
                                    ],
                                },
                                then: "$discount",
                                else: null,
                            },
                        }, } },
                ],
                as: "sizes",
            },
        },
        {
            $lookup: {
                from: "products",
                let: { product: "$product" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$product"] },
                        },
                    },
                    { $project: { image: 1, name: 1, category: 1, slug: 1, _id: 0 } },
                    {
                        $lookup: {
                            from: "categories",
                            let: { category: "$category" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$_id", "$$category"] },
                                    },
                                },
                                { $project: { name: 1, _id: 0 } },
                            ],
                            as: "category",
                        },
                    },
                    { $unwind: "$category" },
                ],
                as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $project: {
                product: 1,
                price: {
                    $let: {
                        vars: {
                            size: { $arrayElemAt: ["$sizes", 0] },
                        },
                        in: "$$size.price"
                    },
                },
                discount: {
                    $let: {
                        vars: {
                            size: { $arrayElemAt: ["$sizes", 0] },
                        },
                        in: "$$size.discount"
                    },
                },
            },
        },
    ]).exec((err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({ success: true, data });
    });
};
exports.getCount = async (req, res) => {
    Like.find({ user: req.user }, { user: 0, __v: 0 }).exec((err, data) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }
        return res.status(200).json({ success: true, data });
    });
};
exports.delete = async (req, res) => {
    await Like.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true });
    });
};
exports.deleteAll = async (req, res) => {
    await Like.deleteMany({ user: req.user }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true });
    });
};
