const cloudnairyzz = require("../config/configCloudnairy")

const uploadedToCloudnairy = async (file) => {
  try{
            const result = await cloudnairyzz.uploader.upload(file)
            return {
                url: result.secure_url,
                publicId: result.public_id
            }

  }catch(e){

    console.error(e)
  }

}

module.exports = uploadedToCloudnairy