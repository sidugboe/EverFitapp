const aws = require("aws-sdk");
const path = require("path");
const crypto = require("crypto");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const region = "us-east-2";
const bucketName = "everfit-images";
const accessKeyId = process.env.S3_USER_ACCESS_KEY;
const secretAccessKey = process.env.S3_USER_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4"
});

const getUploadURL = async () => {
    const imageName = crypto.randomBytes(16).toString("hex");

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 3600
    });

    const url = await s3.getSignedUrlPromise("putObject", params);
    return url;
};

module.exports = {
    getUploadURL
};