const cloudnairy = require("../config/cloudnairy")

const uploadedToCloudnairy = async (file) => {
  try{
            const result = await cloudnairy.uploader.upload(file)
            return {
                url: result.secure_url,
                publicId: result.public_id
            }

  }catch(e){

    console.error(e)
  }

}

module.exports = uploadedToCloudnairy