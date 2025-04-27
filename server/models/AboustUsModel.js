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
    longDescription:{
        type:String,
    },

    isHomepage:{
        type:Boolean,
        default:false
    },
    isAboutusPage:{
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