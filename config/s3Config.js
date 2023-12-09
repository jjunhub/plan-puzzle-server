const aws = require("aws-sdk");

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region : process.env.AWS_REGION
});

const s3 = new aws.S3();

function deleteS3Object(imagePath) {
    const keyPath = imagePath.split('/').pop();
    const params = {
        Bucket: 'planpuzzle-bucket',
        Key: keyPath
    };
    s3.deleteObject(params, (err, data) => {
        if (err) {
            throw err;
        }
    });
}
module.exports = {s3, deleteS3Object};
