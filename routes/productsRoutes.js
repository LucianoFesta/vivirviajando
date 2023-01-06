const express = require('express');
const router = express.Router();
const productsControllers = require('../controllers/productsControllers');
const uploadFile = require('../middleware/products/multerProducts');
const validationsProducts = require('../middleware/products/validacionesBack');

router.get('/create', productsControllers.create);
router.post('/create', uploadFile.single('image'), validationsProducts.createProduct, productsControllers.processCreate);

router.get('/edit/:id', productsControllers.edit);
router.put('/edit/:id', uploadFile.single('image'), validationsProducts.editProduct, productsControllers.processEdit);

router.delete('/delete/:id', productsControllers.delete);

router.get('/recycle', productsControllers.recycle);
router.post('/recycle/:id', productsControllers.processRecycle);

module.exports = router;