const childModel = require("../models/childCategoryModel");
const SubCategoryModel = require("../models/SubCategoryModel");

exports.createChildCategory = async(req,res)=>{

try {
        const {subCategory,
            ChildCategoryName, 
            ChildCategoryImage, 
            imagePublicId, 
            childCategoryDescription,
            bannerImage ,
            isActive
        } = req.body;

        if( !childCategoryName|| 
            !childCategoryImage||
           ! imagePublicId|| 
            !childCategoryDescription){
                return res.status(404).json({message:"field missing", status:404 })
            }
            const child = await childModel.create({
                 ChildCategoryName, 
            ChildCategoryImage, 
            imagePublicId, 
            ChildCategoryDescription,
            bannerImage ,
            isActive
            })
            if(!child){
                res.status(404).json({message:"error while creating child cateogry"})

            } 
                
             const updatedChildCategory = await SubCategoryModel.findByIdAndUpdate(
                        subCategory,
                        { 
                            $push: { childCategory: child._id },
                            $set: { isActive: true } 
                        },
                        { new: true }
                    );
                    if(updatedChildCategory){
                         await childModel.findByIdAndDelete(child._id);
                                    return res.status(404).json({ message: 'Category not found' });
                    }
        res.status(201).json({
            success: true,
            message:"childCtegoryCreated",
            data: {
                childCategory: child,
               
            }
        });

    }catch(e){
        res.status(500).json({status:500,message:"server error",error:error})
    }

}