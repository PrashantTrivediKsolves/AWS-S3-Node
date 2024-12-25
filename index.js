const fs = require('fs');
require("dotenv").config({ path: "./.env" });

console.log("Does .env file exist?", fs.existsSync('./.env'));
console.log("Loaded ENV Variables:", process.env);

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 20 });
  return url;
}

async function init() {
  try {
    console.log("Url for panCard.jpg:", await getObjectURL("panCard.jpg"));
  } catch (error) {
    console.error("Error generating URL:", error);
  }
}

init();
