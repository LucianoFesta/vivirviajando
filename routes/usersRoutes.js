const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/usersControllers');
const uploadFile = require('../middleware/users/multerUsers');
const validationsUser = require('../middleware/users/validacionesBack');
const sessionCheck = require('../middleware/users/sessionCheck');
const loginCheck = require('../middleware/users/loginCheck');

router.get('/login', sessionCheck, usersControllers.login);
router.post('/login', validationsUser.login, usersControllers.processLogin);

router.get('/register', sessionCheck, usersControllers.register);
router.post('/register', uploadFile.single('perfilPhoto'), validationsUser.createUser, usersControllers.processRegister);
router.get('/register/verification/:token', usersControllers.accountVerification);

router.get('/profile', loginCheck, usersControllers.profile);
router.get('/profile/logout', usersControllers.logout);

router.get('/edit/:id', loginCheck, usersControllers.userEdit);
router.post('/edit/:id', uploadFile.single('perfilPhoto'), validationsUser.editUser, usersControllers.processEdit);

router.get('/editPassword/:id', loginCheck, usersControllers.editPassword);
router.put('/editPassword/:id', validationsUser.editPassword, usersControllers.processEditPassword);

router.delete('/profile/delete/:id', loginCheck, usersControllers.deleteUser);

//router.get('/forgotPassword', usersControllers.forgotPassword);

router.get('/cart', loginCheck, usersControllers.cart);

module.exports = router;