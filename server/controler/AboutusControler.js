const aboutusModel = require("../models/AboustUsModel");

exports.CreateAboutusControler = async (req,res)=>{
    try {
        const {heading , description ,isHomepage , isAboutusPage,longDescription } = req.body
        if(!heading || !description){
            return res.status(400).json({message:"Please provide all required fields"})
        }
        const newAboutus = new aboutusModel({
            heading,
            description,
            isHomepage,
            isAboutusPage,
            longDescription
        });
        await newAboutus.save();
        res.status(201).json({ message: 'Aboutus created successfully' });
    }catch(error){
        res.status(500).json({message:"Error creating aboutus",error})
    }
}


exports.getAboutUs = async (req,res)=>{
    try {
        const aboutus =await aboutusModel.find()
        res.status(200).json(aboutus)
    } catch (error) {
        res.status(500).json({message:"Error fetching aboutus",error})          
    }
}

