
const cloudnairy = require("cloudinary").v2;
  cloudnairy.config({
  cloud_name: "dishdojeh",
  api_key: "781311536959573",
  api_secret: "jjdqa4FjQ2TaTxSaQzSEiUPzhHA",
});  

const uploadedToCloudnairy = async (file) => {
  try{
     
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