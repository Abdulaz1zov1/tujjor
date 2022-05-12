exports.validateFile = (req, res, next) => {
    if (!(req.file || req.files)) {
        return res
            .status(404)
            .json({ success: false, message: "File dont Upload" });
    }
    next();
};
