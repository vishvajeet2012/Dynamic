const router = require('express').Router();
const { CreateCategory, GetAllCategories, GetCategoryById, UpdateCategory, DeleteCategory } = require('../../controler/categoryControler')
const {CreateAboutusControler, getAboutUs } = require('../../controler/AboutusControler')
const logoController = require("../../controler/HomePage/HomePage"); // Note: corrected spelling to "controllers"
const {  createSubCategory } = require('../../controler/SubCategoryControler');
const auth = require('../../middleware/authmiddleware');

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
module.exports = router;