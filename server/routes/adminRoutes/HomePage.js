const router = require('express').Router();
const uploadImageonCloud= require("../../controler/ImageContoker")

const { CreateCategory, GetAllCategories, GetCategoryById, UpdateCategory, DeleteCategory } = require('../../controler/categoryControler')
const {CreateAboutusControler, getAboutUs } = require('../../controler/AboutusControler')
const logoController = require("../../controler/HomePage/HomePage"); // Note: corrected spelling to "controllers"
const {  createSubCategory } = require('../../controler/SubCategoryControler');
const auth = require('../../middleware/authmiddleware');
const uploadImageMiddleware = require('../../middleware/uploadImageMiddleware');
const { createBanner, updateBanner, deleteBanner, toggleBannerActive, getBannersByType } = require('../../controler/BannerControler');
const { createProduct, getProducts } = require('../../controler/Productcontroler');

router.post("/homelogo", logoController.createLogo);
router.get("/gethomelogo", logoController.getLogo); 
router.delete("/deltehomelogo/", logoController.deleteLogo); 
router.post('/categorycreate',CreateCategory)

router.get('/categoryupdatebyid/:id', GetCategoryById);
router.put('/updatecategory/:id', UpdateCategory);
router.delete('/deletecategory/:id', DeleteCategory);

router.post('/createaboutus', CreateAboutusControler )
router.get('/getaboutus', getAboutUs)


router.get('/getallcategory',auth,GetAllCategories)
router.post('/subcategorycreate',createSubCategory)

router.post('/uploadImage' ,auth,uploadImageMiddleware.single('image'), uploadImageonCloud.uploadImageController)
router.get("/get", auth, uploadImageonCloud.fetchImagesController);

//delete image route
router.delete("/deleteImage/:id", auth, uploadImageonCloud.deleteImageController);


router.post('/bannercreates', auth, createBanner);
router.put('/updatebanner/:id', auth,updateBanner);
router.delete('/deletebaner/:id', auth,deleteBanner);
router.post('/getbannersbytype' ,auth,getBannersByType)
router.patch('/:id/toggle-active',auth, toggleBannerActive);


    /////////////////////////Product ////////////////
    router.post('/productcreate', auth, createProduct);
    router.get('/getallproduct',auth,getProducts)
    


module.exports = router;