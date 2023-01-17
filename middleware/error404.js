function error404 (req,res,next){
    res.render('error404', {
        title: 'Error 404',
        user: req.session.loggedUser
    })

    next()
}

module.exports = error404;