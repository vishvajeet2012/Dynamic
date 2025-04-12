const router = require('express').Router();
const { CreateCategory } = require('../../controler/categoryControler')

const logoController = require("../../controler/HomePage/HomePage"); // Note: corrected spelling to "controllers"
const { CreateSubCategory } = require('../../controler/SubCategoryControler');

router.post("/homelogo", logoController.uploadLogo);
router.get("/admin/homepage/mainlogo", logoController.getLogo); // Changed from getCurrentLogo to getLogo
router.delete("/admin/homepage/mainlogo", logoController.deleteLogo); // Fixed typo from "mailogo" to "mainlogo"
router.post('/categorycreate',CreateCategory)
router.post('/subcategorycreate',CreateSubCategory)
module.exports = router;