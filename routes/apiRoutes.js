const express = require('express');
const router = express.Router();

const apiControllers = require('../controllers/apiControllers');

router.get('/product/:id', apiControllers.product);
router.post('/checkoutCart', apiControllers.checkoutCart);

module.exports = router;