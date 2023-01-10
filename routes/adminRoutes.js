const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/adminControllers');
const loginAdminCheck = require('../middleware/users/loginAdminCheck');
const uploadFile = require('../middleware/users/multerUsers');
const validationsUser = require('../middleware/users/validacionesBack');


router.get('/listUsers', [loginAdminCheck], adminControllers.listUsers);

router.get('/userEdit/:id', [loginAdminCheck], adminControllers.userEdit);
router.put('/userEdit/:id',[uploadFile.single('perfilPhoto'), validationsUser.editUser], adminControllers.processEdit);

router.delete('/userDelete/:id', adminControllers.userDelete);

module.exports = router;