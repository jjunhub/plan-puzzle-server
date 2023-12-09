const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const {s3} = require("./s3Config");

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata : function(req, file, cb){
            cb(null, {fieldName : file.fieldname});
        },
        key : async function(req, file, cb){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            const base = path.basename(file.originalname, ext);
            cb(null, base + '-' + uniqueSuffix + ext);
        },
        limits: {fileSize: 5 * 1024 * 1024},
    }),
});

module.exports = upload;
