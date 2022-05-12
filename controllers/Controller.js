const Product = require("../models/product");
exports.popularProducts = async (req, res) => {
    await Product.aggregate([
        {$match: {status: 1, isDelete: false, shopIsActive: 1}},
        {$match: {views: {$gte: 2}}},
        { $sample: { size: 10 } },
            {
                $project: {
                    name: 1,
                    category: 1,
                    image: 1,
                    slug: 1,
                    createdAt: 1,
                    views: 1,
                    discount: {
                        $cond: {
                            if: {
                                $and: [
                                    { $gte: ["$minSize.discount_end", new Date()] },
                                    { $lte: ["$minSize.discount_start", new Date()] },
                                ],
                            },
                            then: "$minSize.discount",
                            else: null,
                        },
                    },
                    price: "$minSize.price",
                },
            },
            {
                $project: {
                    name: 1,
                    category: 1,
                    image: 1,
                    slug: 1,
                    createdAt: 1,
                    views: 1,
                    price: 1,
                    discount: 1,
                    sortPrice: { $ifNull: [ "$discount", "$price" ] }
                },
            },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },
        { $unwind: "$category" },
        {
            $project: {
                name: 1,
                category: "$category.name",
                image: 1,
                slug: 1,
                price: 1,
                discount: 1,
            },
        },
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data,
        });
    });
}
exports.getDiscounts = async (req, res) => {
   const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    
    if (page === 0 || limit === 0) {
        return res.status(400).json({ success: false, message: "Error page or limit" });
    }
    let redisText = `PF_${page}_${limit}_discount_`
    let aggregateStart = [{$match: {status: 1, isDelete: false, shopIsActive: 1}}];
    const reply = await req.GET_ASYNC(redisText)
    if(reply){
        return res.status(200).json({success: true, data: JSON.parse(reply)})
    }
    await Product.aggregate([
        ...aggregateStart,
        {
            $project: {
                name: 1,
                category: 1,
                image: 1,
                slug: 1,
                views: 1,
                createdAt: 1,
                updatedAt: 1,
                discount: {
                    $cond: {
                        if: {
                            $and: [
                                { $gte: ["$minSize.discount_end", new Date()] },
                                { $lte: ["$minSize.discount_start", new Date()] },
                            ],
                        },
                        then: "$minSize.discount",
                        else: null,
                    },
                },
                price: "$minSize.price",
            },
        },
        { $match: { discount: { $ne:null} }}, 
        { $sort: { updatedAt: -1}},
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },
        { $unwind: "$category" },
        {
            $project: {
                name: 1,
                category: "$category.name",
                image: 1,
                slug: 1,
                price: 1,
                discount: 1,
            },
        },
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
            req.SET_ASYNC(redisText, JSON.stringify(data), 'EX', 60)
        res.status(200).json({
            success: true,
            data,
        });
    });
}