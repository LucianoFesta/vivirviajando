const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/usersControllers');
const uploadFile = require('../middleware/users/multerUsers');
const validationsUser = require('../middleware/users/validacionesBack');
const sessionCheck = require('../middleware/users/sessionCheck');
const loginCheck = require('../middleware/users/loginCheck');
const cookieCheck = require('../middleware/users/cookieCheck');
const loginAdminCheck = require('../middleware/users/loginAdminCheck');

router.get('/login', [cookieCheck, sessionCheck], usersControllers.login);
router.post('/login', [validationsUser.login], usersControllers.processLogin);

router.get('/register', [cookieCheck, sessionCheck], usersControllers.register);
router.post('/register', [uploadFile.single('perfilPhoto'), validationsUser.createUser], usersControllers.processRegister);
router.get('/register/verification/:token', usersControllers.accountVerification);

router.get('/profile', [cookieCheck, loginCheck], usersControllers.profile);
router.get('/profileViewAdmin/:id', [loginAdminCheck], usersControllers.profileViewAdmin);
router.get('/profile/logout', usersControllers.logout);

router.get('/edit/:id', [cookieCheck, loginCheck], usersControllers.userEdit);
router.put('/edit/:id', [uploadFile.single('perfilPhoto'), validationsUser.editUser], usersControllers.processEdit);

router.get('/editPassword/:id', [cookieCheck, loginCheck], usersControllers.editPassword);
router.put('/editPassword/:id',[validationsUser.editPassword], usersControllers.processEditPassword);

router.delete('/profile/delete/:id', [cookieCheck, loginCheck], usersControllers.deleteUser);

router.get('/cart', [cookieCheck, loginCheck], usersControllers.cart);

router.get('/forgotPassword', usersControllers.forgotPassword);
router.post('/forgotPassword', [validationsUser.forgotPassword], usersControllers.processForgotPassword);
router.get('/forgotPassword/:token', usersControllers.newPasswordForget);
router.post('/forgotPassword/:token', [validationsUser.newPasswordForget], usersControllers.processNewPasswordForget);

router.get('/search/:page', usersControllers.search);


module.exports = router;