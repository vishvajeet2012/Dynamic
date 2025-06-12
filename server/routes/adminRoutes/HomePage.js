const router = require('express').Router();
const uploadImageonCloud= require("../../controler/ImageContoker")

const { CreateCategory, GetAllCategories, GetCategoryById, UpdateCategory, DeleteCategory } = require('../../controler/categoryControler')
const {CreateAboutusControler, getAboutUs } = require('../../controler/AboutusControler')
const logoController = require("../../controler/HomePage/HomePage"); // Note: corrected spelling to "controllers"
const {  createSubCategory } = require('../../controler/SubCategoryControler');
const auth = require('../../middleware/authmiddleware');
const uploadImageMiddleware = require('../../middleware/uploadImageMiddleware');

router.post("/homelogo", logoController.uploadLogo);
router.get("/admin/homepage/mainlogo", logoController.getLogo); 
router.delete("/admin/homepage/mainlogo", logoController.deleteLogo); 
router.post('/categorycreate',CreateCategory)

router.get('/categoryupdatebyid/:id', GetCategoryById);
router.put('/updatecategory/:id', UpdateCategory);
router.delete('/deletecategory/:id', DeleteCategory);

router.post('/createaboutus', CreateAboutusControler )
router.get('/getaboutus', getAboutUs)


router.get('/getallcategory',auth,GetAllCategories)
router.post('/subcategorycreate',createSubCategory)

router.post("/uploadImage" , uploadImageonCloud.uploadImageController)
router.get("/get", auth, uploadImageonCloud.fetchImagesController);

//delete image route
router.delete("/:id", auth, uploadImageonCloud.deleteImageController);

module.exports = router;