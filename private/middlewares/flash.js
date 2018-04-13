module.exports = function (req, res, next) {

    if (req.session.flash) {
        res.locals.flash = req.session.flash
        req.session.flash = undefined
    }

    req.flash = function (type, content) {
        if (req.session.flash === undefined)
            req.session.flash = {}
        req.session.flash[type] = content
    }

    req.flashAdd = function (type, content) {
        console.log(type +' --- '+content)
        if (req.session.flash === undefined)
            req.session.flash = {}
        if (req.session.flash[type] === undefined)
            req.session.flash[type] = new Array()
        req.session.flash[type].push(content)
    }

    next()
}