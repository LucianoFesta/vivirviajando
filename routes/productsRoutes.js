const express = require('express');
const router = express.Router();
const productsControllers = require('../controllers/productsControllers');
const uploadFile = require('../middleware/products/multerProducts');
const validationsProducts = require('../middleware/products/validacionesBack');
const loginAdminCheck = require('../middleware/users/loginAdminCheck');

router.get('/create', [loginAdminCheck], productsControllers.create);
router.post('/create', [uploadFile.single('image'), validationsProducts.createProduct], productsControllers.processCreate);

router.get('/edit/:id', [loginAdminCheck], productsControllers.edit);
router.put('/edit/:id', [uploadFile.single('image'), validationsProducts.editProduct], productsControllers.processEdit);

router.delete('/delete/:id', [loginAdminCheck], productsControllers.delete);

router.get('/recycle', [loginAdminCheck], productsControllers.recycle);
router.post('/recycle/:id', [loginAdminCheck], productsControllers.processRecycle);

module.exports = router;