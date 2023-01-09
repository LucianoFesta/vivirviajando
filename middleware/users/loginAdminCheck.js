function loginAdminCheck(req,res,next){

    if(!req.session.loggedUser){
        res.redirect('/users/login');
    }else if(req.session.loggedUser.id_tipoUsuario !== 1){
        res.redirect('/users/profile');
    }else{
        return next()
    }
    
}

module.exports = loginAdminCheck;