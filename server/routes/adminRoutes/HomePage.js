const router = require('express').Router();
const { CreateCategory } = require('../../controler/categoryControler')

const logoController = require("../../controler/HomePage/HomePage"); // Note: corrected spelling to "controllers"
const {  createSubCategory } = require('../../controler/SubCategoryControler');

router.post("/homelogo", logoController.uploadLogo);
router.get("/admin/homepage/mainlogo", logoController.getLogo); 
router.delete("/admin/homepage/mainlogo", logoController.deleteLogo); 
router.post('/categorycreate',CreateCategory)
router.post('/subcategorycreate',createSubCategory)
module.exports = router;