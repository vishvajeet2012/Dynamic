const moongoose = require('mongoose')
const aboutusSchema =  new moongoose.Schema({
    heading:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true

    },
    isHomepage:{
        type:Boolean,
        default:false
    },
 createdAt:{
        type:Date,
        default:Date.now
    }   
})

const aboutusModel = moongoose.model('AboutUs',aboutusSchema)
module.exports=aboutusModel