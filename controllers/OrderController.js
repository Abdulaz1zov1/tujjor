const Order = require("../models/order");
const OrderProducts = require("../models/orderProducts");
const Shop = require("../models/shop");
const Size = require("../models/size");
const Product = require("../models/product");
const Param = require("../models/param");
const mongoose = require("mongoose");
const SMS = require("../utils/sms");
exports.create = async (req, res) => {
    try {
        
        if(!(req.body.products && req.body.products.length)){
            return res
                .status(400)
                .json({ success: false, message: "Something went wrong" });
        }
        const lastDat = await Order.findOne().sort( { createdAt: -1 } );
        const count = lastDat ? lastDat.orderId + 1 : 1;
        let summ = 0;
        const DOSTAVKA_PRICE = 20000;
        let shops =  [];
        const products = await Promise.all(
            req.body.products.map(async (element) => {
                let size = await Size.findById({_id: element.size});
                let product = await Product.findById({_id: element.product});
                let param = await Param.findById({_id: element.param});
                let shop = await Shop.findById({ _id: product.shop });
                if(shops.indexOf(shop._id.toString()) === -1) shops.push(shop._id.toString());
                if(size.discount && new Date(size.discount_start) <= new Date() && new Date(size.discount_end) >= new Date()){
                if (size.discount !== element.amount) {
                    return;
                } else {
                    summ += size.discount * element.count
                }               
                } else {
                    if (size.price !== element.amount) {
                        return;
                    } else {
                        summ += size.price*element.count
                    }
                };
                return {
                    status: 11,
                    orderId: count,
                    user: req.user,
                    count: element.count,
                    //product Items
                    productId: product._id,
                    name: product.name,
                    image: product.image,
                    description: product.description,
                    article: product.article,
                    slug: product.slug,
                    category: product.category,
                    brand: product.brand,
                    //param Items
                    paramId: param._id,
                    paramImage: param.image,
                    //size Items
                    sizeId: size._id,
                    size: size.size,
                    amount: element.amount,
                    payedAmount: element.count * element.amount *(100 - shop.percent) / 100,
                    //shop Items
                    shopId: shop._id,
                    account: shop.shopId,
                    percent: shop.percent
                };
            })
        )
        const dostavka = req.body.toMyHouse ? shops.length * DOSTAVKA_PRICE: 0
        summ += dostavka;
        const order = new Order({
            user: req.user,
            amount: req.body.amount,
            orderId: count,
            address: {
                region: req.body.address ? req.body.address.region : null,
                district: req.body.address ? req.body.address.district : null,
                address: req.body.address ? req.body.address.address : null,
                phone: req.body.address ? req.body.address.phone : null,
            },
            name: req.body.name,
            shopCount : shops.length,
            dostavka : dostavka
        });
        if (summ !== req.body.amount || !products.length) {
            return res.status(400).json({ success: false, message: "Something went wrong" });
        }
        products.forEach((element, index)=>{
            if(index === products.length-1){
                new OrderProducts(element).save().then(()=>{
                order.save().then(() => {
                        return res.status(201).json({ success: true, data: {orderId: order.orderId, amount: order.amount}});
                    })
                    .catch((err) => {
                        return res.status(400).json({ success: false, err });
                    });
                }).catch(err=>{
                    OrderProducts.deleteMany({orderId: order.orderId})
                    return res.status(400).json({ success: false, err });
                })
            } else {
                new OrderProducts(element).save().catch(err=>{
                    OrderProducts.deleteMany({orderId: order.orderId})
                    return res.status(400).json({ success: false, err });
                })
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong"});
    }
};
exports.getById = async (req, res) => {
    try {
        const shop = await Shop.findOne({user: req.user})
        const order = await Order.findOne({
            orderId: parseInt(req.params.orderId)
        },{orderId: 1, name: 1, address: 1, user: 1, createdAt: 1, dostavka: 1})
        .populate({ path: "address", 
            populate: {
                path: "region",
                select: "name"
            }
        })
        .populate({ path: "address", 
            populate: {
                path: "district",
                select: "name"
            }
        })
        .populate({path: "user", select: "name"})
        if(!order){
            return res.status(404).json({success: false, message: "Not Found"});
        }
        await OrderProducts.aggregate([
            {$match: { shopId: mongoose.Types.ObjectId(shop._id), orderId: parseInt(req.params.orderId)} },
            {$project: {
                name: 1,
                image: 1,
                paramImage: 1,
                size: 1,
                amount: "$payedAmount",
                count: 1,
                article: 1,
                slug: 1,
                description: 1,
                status: 1,
                orderId: 1
            }}
        ]).exec((err, data) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({
                success: true,
                data: {
                    dostavka: order.dostavka,
                    orderId: order.orderId,
                    address:  order.address,
                    createdAt: order.createdAt,
                    name: order.name,
                    user: order.user,
                    products: data
                }
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong "})
    }
}
exports.getAll = async (req, res) => {
    try {    
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const status = parseInt(req.query.status);
        const shop = await Shop.findOne({user: req.user})
        console.log("status ", status);
        let count = 0;
        await OrderProducts.aggregate([ 
            { $match: { status: status, shopId: mongoose.Types.ObjectId(shop._id)} },
            {
                $group: {_id: "$orderId"}
            },
            {
                $group: {_id: "$_id", count: {$sum: 1}}
            },
        ]).exec((err, data)=>{
            if(err) return res.status(400).json({ success: false, err })
            count = data[0]?data[0].count:0
        })
        await OrderProducts.aggregate([
            { $match: { status: status, shopId: mongoose.Types.ObjectId(shop._id)} },
            {$project: {
                name: 1,
                image: 1,
                paramImage: 1,
                size: 1,
                payedAmount: 1,
                count: 1,
                article: 1,
                description: 1,
                status: 1,
                orderId: 1
            }},
            {$group: {
                _id: "$orderId",
                amount: {$sum:  "$payedAmount"},
                count: {$sum: 1}
            }},
            { $skip: (page - 1) * limit }, 
            { $limit: limit },
            {
                $lookup: {
                    from: "orders",
                    let: { orderId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$orderId", "$$orderId"],
                                },
                            },
                        },
                        {$lookup: {
                            from: "regions",
                            localField: "address.region",
                            foreignField: "_id",
                            as: "address.region"
                        }},
                        {$lookup: {
                            from: "districts",
                            localField: "address.district",
                            foreignField: "_id",
                            as: "address.district"
                        }},
                        {$lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user"
                        }},
                        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true }},
                        { $unwind: { path: "$address.region", preserveNullAndEmptyArrays: true }},
                        { $unwind: { path: "$address.district", preserveNullAndEmptyArrays: true }},
                        {
                            $project: {
                                user: "$user.name",
                                amount: 1,
                                orderId: 1,
                                dostavka: 1,
                                address: {
                                    region:{
                                        name: "$address.region.name"
                                    },
                                    district: {
                                        name: "$address.district.name",
                                    },
                                    address: 1,
                                    phone: 1
                                },
                                createdAt: 1
                            }
                        }
                    ],
                    as: "order"
                }
            },
            {$unwind: "$order"},
            {$project: {
                user: "$order.user",
                amount: 1,
                count: 1,
                dostavka: "$order.dostavka",
                orderId: "$order.orderId",
                address: "$order.address",
                createdAt: "$order.createdAt",
                _id: 0
            }},

            {$sort: {createdAt: -1}},
        ]).exec((err, data) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({
                success: true,
                data,
                count
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong"});
    }
};
exports.update = async (req, res) => {
    try {
        let orderProducts = await OrderProducts.findById({ _id: req.params.id});
        let shop = await Shop.findOne({user: req.user})
        if(!shop  || !orderProducts || orderProducts.shopId.toString() != shop._id.toString() || orderProducts.status >= 1){
            return res.status(400).json({ success: false, message: "Something went wrong"})
        }
        orderProducts.status = orderProducts.status + 1;
        orderProducts.save().then(()=>{
            res.status(200).json({success: true})
        }).catch(()=>{
            res.status(400).json({success: false})
        })
    } catch (error) {
        tes.status(500).json({success: false, message: "Something went wrong"});
    }
}
exports.delivered = async (req, res) => {
    let orderProducts = await OrderProducts.findOne({ _id: req.params.id, user: req.user});
    if(!orderProducts || orderProducts.status != 1){
        return res.status(400).json({ success: false, message: "Something went wrong"})
    }
    orderProducts.status = 5;
    orderProducts.save().then(()=>{
        res.status(200).json({success: true})
    }).catch(()=>{
        res.status(400).json({success: false})
    })
}
exports.getMeOrder = async (req, res) => {
    let status = {};
    if (req.query.status === "notPayed") {
        status = { $match: { status: 11} };
    } else if (req.query.status === "payed") {
        status = { $match: { status: 0} };
    } else if (req.query.status === "onTheWay") {
        status = { $match: { status: 1 } };
    } else if (req.query.status === "delivered") {
        status = { $match: { status: 5 } };
    } else if (req.query.status === "canceled") {
        status = { $match: { status: 10 } };
    }
    OrderProducts.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user)} },
        status,
        {$sort: {createdAt: -1}},
        {$project: {
            name: 1,
            image: 1,
            paramImage: 1,
            productId: 1,
            size: 1,
            amount: 1,
            count: 1,
            description: 1,
            status: 1,
            orderId: 1
        }},
    ]).exec((err, data) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
            data,
        });
    });
};
exports.sendSms = async (req, res)=>{
    const {phone,link} = req.body;
    SMS(phone, link).then(()=>{
        res.status(200).json({ success: true })
    }).catch(() =>{
        res.status(500).json({ success: false, message: "Something went wrong"})
    })
}

// exports.changeData = async (req, res) => {
//     const orderProducts = await OrderProducts.find();
//     orderProducts.forEach(async (key, index) => {
//         const product = await Product.findById({_id: key.productId});
//         key['article'] = product.article;
//         key['slug'] = product.slug;
//         key.save();
//         console.log(orderProducts.length, index);
//     })
// }