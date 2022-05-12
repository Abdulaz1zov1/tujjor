const Category = require("../models/category");
const { getSlug } = require("../utils");
const { updateStatusByCategory } = require("../utils/preModel");
function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined);
    } else {
        category = categories.filter((cat) => cat.parentId == parentId);
    }
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: {
                uz: cate.name.uz,
                ru: cate.name.ru,
            },
            parentId: cate.parentId,
            slug: cate.slug,
            children: createCategories(categories, cate._id),
        });
    }
    return categoryList;
}
function getCategoriesCreate(categories, parentId) {
    const categoryList = [];
    let category;
    category = categories.filter((cat) => cat.parentId == parentId);
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: {
                uz: cate.name.uz,
                ru: cate.name.ru,
            },
            parentId: cate.parentId,
            slug: cate.slug,
            children: createCategories(categories, cate._id),
        });
    }
    return categoryList;
}
const deleteCategory = async (parentId) => {
    let item = await Category.find({ parentId });
    if (item.length) {
        item.forEach((key) => {
            Category.findByIdAndDelete({ _id: key._id }).then((data) => {
                updateStatusByCategory(data._id);
                deleteCategory(key._id);
            });
        });
    }
};
exports.create = (req, res) => {
    const category = new Category({
        name: {
            uz: req.body.name.uz,
            ru: req.body.name.ru,
        },
        slug: getSlug(req.body.name.ru),
    });
    if (req.body.parentId) {
        category.parentId = req.body.parentId;
    }
    category
        .save()
        .then(() => {
            res.status(200).json({ success: true, data: category });
        })
        .catch((err) => {
            res.status(400).json({ success: false, err });
        });
};
exports.getAllForAdmin = async (req, res) => {
    try {
        const redisText = "CATEGORY_ALL"
        await Category.find().exec( async (err, categories) => {
            if (err) {return res.status(400).json({ success: false, err })}
            if (categories) {
                const categoryList = createCategories(categories);
                req.SET_ASYNC(redisText, JSON.stringify(categoryList), 'EX', 60)
                res.status(200).json({ success: true, data: categoryList });
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error })
    }
}
exports.getAll = async (req, res) => {
    try {
        const redisText = "CATEGORY_ALL"
        const reply = await req.GET_ASYNC(redisText)
        if(reply){
            return res.status(200).json({success: true, data: JSON.parse(reply)})
        }
        await Category.find().exec( async (err, categories) => {
            if (err) {return res.status(400).json({ success: false, err })}
            if (categories) {
                const categoryList = createCategories(categories);
                req.SET_ASYNC(redisText, JSON.stringify(categoryList), 'EX', 60)
                res.status(200).json({ success: true, data: categoryList });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error })
    }
};
exports.getOne = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: "Required" });
        }
        await Category.find({}, {slug: 0}).exec(async (err, categories) => {
            if (err) {return res.status(400).json({ err });}
            if (categories) {
                const category = categories.find((cat) => cat._id == req.params.id);
                const categoryList = getCategoriesCreate(categories, req.params.id);
                if(!!category){
                    res.status(200).json({ success: true, data: {
                        _id: category._id,
                        name: category.name,
                        children: categoryList,
                    } });
                } else {
                    res.status(200).json({ success: true, data: [] });
                }
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error })
    }
};
exports.delete = async (req, res) => {
    await Category.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        deleteCategory(req.params.id);
        updateStatusByCategory(data._id);
        res.status(200).json({ data: [] });
    });
};
exports.edit = async (req, res) => {
    await Category.updateOne({ _id: req.params.id }, { $set: req.body }, (err, data) => {
        if (err) return res.status(400).json({ success: false });
        res.status(200).json({ success: true });
    });
};
