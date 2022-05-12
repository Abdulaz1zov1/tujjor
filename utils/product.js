const sharp = require("sharp");
const path = require("path");
const { deleteFile } = require(".");
exports.sharpProductImage = async (filename) => {
    try {
        sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize(500, 450)
        .toFile(
            path.join(path.dirname(__dirname) + `/public/uploads/products/${filename}`),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
    } catch (error) {
        console.log(error)
    }
};
exports.sharpParamImage = async (filename) => {
    try {
        sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
       .resize(500, 450)
       .toFile(
           path.join(
               path.dirname(__dirname) + `/public/uploads/products/colors/${filename}`
           ),
           (err) => {
               if (err) {
                   console.log(err);
               }
               deleteFile(`/public/temp/${filename}`);
           }
       );
    } catch (error) {
        console.log(error)
    }
};
exports.sharpFrontImage = async (filename) => {
    try {
        sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .jpeg({quality: 70})
        .resize(222, 222)
        .toFile(
            path.join(
                path.dirname(__dirname) + `/public/uploads/products/cards/${filename}`
            ),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
    } catch (error) {
        console.log(error)
    }
};
exports.sharpFooterImage = async (filename) => {
    try {
        sharp(path.join(path.dirname(__dirname) + `/public/temp/${filename}`))
        .resize({ with: 1200 })
        .toFile(
            path.join(
                path.dirname(__dirname) + `/public/uploads/products/footer/${filename}`
            ),
            (err) => {
                if (err) {
                    console.log(err);
                }
                deleteFile(`/public/temp/${filename}`);
            }
        );
    } catch (error) {
        console.log(error)
    }
};