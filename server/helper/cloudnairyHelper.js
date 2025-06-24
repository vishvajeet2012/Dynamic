require("dotenv").config();


const uploadedToCloudnairy = async (file) => {
  try{
     const cloudnairy = require("cloudinary").v2;
  cloudnairy.config({
  cloud_name: process.env.CLOUND_NAME,
   api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
}); 
    const result = await cloudnairy?.uploader?.upload(file)
            return {
                url: result.secure_url,
                publicId: result.public_id
            }

  }catch(e){

    console.error(e)
  }

}

module.exports = uploadedToCloudnairy