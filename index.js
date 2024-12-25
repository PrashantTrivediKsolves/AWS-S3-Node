const fs = require('fs');
require("dotenv").config({ path: "./.env" });

console.log("Does .env file exist?", fs.existsSync('./.env'));
console.log("Loaded ENV Variables:", process.env);

const { S3Client, GetObjectCommand ,PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand} = require("@aws-sdk/client-s3");
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


async function putObject(filename , contentType)
{
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `/uploads/user-uploads/${filename}`,
    ContentType:contentType
  })
  const url = await getSignedUrl(s3Client ,command);
  return url;

}

async function listObjects()
{
  const command =  new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: '/'
  })
  const result =  await s3Client.send(command);
  console.log(result);
}
async function init() {
  try {
    // console.log("Url for panCard.jpg:", await getObjectURL("/uploads/user-uploads/image-1735154328967.jpg"));
    // console.log("URL for uploading", await putObject(`image-${Date.now()}.jpg`,"image/jpg"));
  } catch (error) {
    console.error("Error generating URL:", error);
  }
  // await listObjects();

  // this commad is used to delete the object

  // const cmd = new DeleteObjectCommand({
  //   Bucket :  process.env.AWS_BUCKET_NAME,
  //   Key:'graphql.jpeg'
  // })
  // await s3Client.send(cmd);
}

init();
