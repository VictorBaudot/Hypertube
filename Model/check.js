const pwdRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nomRegex = new RegExp("^[a-zA-Z]{3,16}$");
const loginRegex = new RegExp("^[a-zA-Z0-9_]{3,16}$");

var Check = {

    // - Pas deja pris
    // - Taille raisonnable
    // - Format correct
    login: login = (login, req, cb) => {
        let rep = true
        if (!loginRegex.test(login)) {
            req.flashAdd('tabError', 'Pseudo: format incorrect')
            rep = false
        }
        let User = require('./user')
        User.findByLogin(login, (row) => {
            if (row) {
                req.flashAdd('tabError', 'Ce pseudo n\'est pas disponible')
                rep = false
            }
            cb(rep)
        })
    },

    // - Pas d'espace
    // - Uniquement des lettres
    // - Taille correcte
    prenom: prenom = (nom, req, cb) => {
        let rep = true
        if (!nomRegex.test(nom)) {
            req.flashAdd('tabError', 'Prenom: format incorrect')
            rep = false
        }
        cb(rep)
    },
    nom: nom = (nom, req, cb) => {
        let rep = true
        if (!nomRegex.test(nom)) {
            req.flashAdd('tabError', 'Nom: format incorrect')
            rep = false
        }
        cb(rep)
    },
    // - Pas deja pris
    // - Format correct
    email: email = (email, req, cb) => {
        let rep = true
        let User = require('./user')
        User.findByEmail(email, (rows) => {
            if (rows.length) {
                req.flashAdd('tabError', 'Cet email n\'est pas disponible')
                rep = false
            } else if (!emailRegex.test(email)) {
                req.flashAdd('tabError', 'Syntaxe de l\'email invalide');
                rep = false
            }
            cb(rep)
        })
    },

    // - Password === confirmation
    // - Format correct
    password: password = (password, confirm, req, cb) => {
        let rep = true
        if (!confirm || password !== confirm) {
            req.flashAdd('tabError', 'Les mots de passe ne correspondent pas.');
            rep = false
        }
        if (!pwdRegex.test(password)) {
            req.flashAdd('tabError', 'Mot de passe en carton. ([a-z]+[A-Z]+[0-9])*(6-20)');
            rep = false
        }
        cb(rep)
    },

}

module.exports = Check