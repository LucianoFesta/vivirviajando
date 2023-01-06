function cookieCheck(req,res,next) {
    if(req.cookies.remindMe == undefined){
        next()
    }else{
        req.session.loggedUser = req.cookies.remindMe
        next()
    }
};

module.exports = cookieCheck;