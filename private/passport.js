const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const LinkedinStrategy = require('passport-linkedin').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs');
const SQL = require('../Model/SQL.class');
const sql = new SQL();

const FACEBOOK_APP_ID = '212847129480653'
const FACEBOOK_APP_SECRET = 'fef4a6f5a25ba642811cce2f412a67f6'
const GITHUB_APP_ID = '10ef8957267003c42318'
const GITHUB_APP_SECRET = 'a5fdbda730e7060da9b233edff8c062dbeb724c5'
const LINKEDIN_APP_ID = '86m9lk4gk9n6cu'
const LINKEDIN_APP_SECRET = 'qCb9bU4Sa7WTx02C'
const GOOGLE_CLIENT_ID = '417161231555-h830g287ns38gkd7rqaq625839rh0al7.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = 'WXgUyDc86wAF9Y5E4YuOLAQG'
const TWITTER_CONSUMER_KEY = 'IidPkloSmiH1W4uRuYkeuP9HP'
const TWITTER_CONSUMER_SECRET = 'PE3swPhmFZA3YC5nNnJxOJQOrbjYr9hpPBgyTgIL902stGExLo'
const FORTYTWO_APP_ID = 'ff7d5d612e9972ef32dba3e2ecee80a5d7167faba6f03ae3c9437716b62159b8'
const FORTYTWO_APP_SECRET = '9f72df0188b6f08d8f7cfb000866a75645c50e048b2ae3e53e4d86e46f36ee3a'

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null,user.id)
    })

    passport.deserializeUser((id, done) => {
        sql.select('*', 'users', {}, {id: id}).then(result => {
            done(null, result[0]);
        })
    })

    // =========================================================================
    // FACEBOOK STRATEGY  ======================================================
    // =========================================================================

    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "https://localhost:3001/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile)
        done(null)
      }
    ));

    // =========================================================================
    // GOOGLE STRATEGY  ========================================================
    // =========================================================================

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        // console.log(profile)
        sql.select('*', 'users', {}, {googleId: profile.id}).then(result => {
            if (Object.keys(result).length > 0) return done(null, result[0]);
            else {
                let newpwd = generatePassword()
                var newUser = {
                    googleId: profile.id,
                    login: profile.name.givenName + profile.name.familyName,
                    photo: profile.photos[0].value,
                    psswd: bcrypt.hashSync(newpwd, bcrypt.genSaltSync(9)),
                    token: bcrypt.hashSync('hypertube'+login, bcrypt.genSaltSync(9)).replace(/\//g, '')
                };
                // console.log(newUser)
                sql.insert('users', newUser).then((result) => {
                    let user = {id: result.insertId}
                    return done(null, user);
                });
            }
        });
      }
    ));

    // =========================================================================
    // GITHUB STRATEGY  ======================================================
    // =========================================================================

    passport.use(new GitHubStrategy({
        clientID: GITHUB_APP_ID,
        clientSecret: GITHUB_APP_SECRET,
        callbackURL: "http://localhost:3001/auth/github/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        // console.log(profile)
        let {id, login, avatar_url, email} = profile._json
        // console.log(id + '\n' + login + '\n' + avatar_url + '\n' + email)
        sql.select('*', 'users', {}, {githubId: id}).then(result => {
            if (Object.keys(result).length > 0) return done(null, result[0]);
            else {
                let newpwd = generatePassword()
                var newUser = {
                    githubId: id,
                    login: login + id,
                    photo: avatar_url,
                    email: email,
                    psswd: bcrypt.hashSync(newpwd, bcrypt.genSaltSync(9)),
                    token: bcrypt.hashSync('hypertube'+login, bcrypt.genSaltSync(9)).replace(/\//g, ''),
                    email_confirmed: 1
                };
                console.log(newUser)
                sql.insert('users', newUser).then((result) => {
                    let user = {id: result.insertId}
                    return done(null, user);
                });
            }
        });
      }
    ));

    // =========================================================================
    // LINKEDIN STRATEGY  ======================================================
    // =========================================================================

    passport.use(new LinkedinStrategy({
        consumerKey: LINKEDIN_APP_ID,
        consumerSecret: LINKEDIN_APP_SECRET,
        callbackURL: "http://localhost:3001/auth/linkedin/callback"
      },
      function(token, tokenSecret, profile, done) {
        // console.log(profile)
        let photo = '/pics/default.jpg';
        let {id, firstName, lastName} = profile._json
        // console.log(id + '\n' + firstName + '\n' + lastName)
        sql.select('*', 'users', {}, {linkedinId: id}).then(result => {
            if (Object.keys(result).length > 0) return done(null, result[0]);
            else {
                let newpwd = generatePassword()
                var newUser = {
                    linkedinId: id,
                    login: firstName + lastName + id,
                    first_name: capitalizeFirstLetter(firstName),
                    last_name: capitalizeFirstLetter(lastName),
                    photo,
                    psswd: bcrypt.hashSync(newpwd, bcrypt.genSaltSync(9)),
                    token: bcrypt.hashSync('hypertube'+login, bcrypt.genSaltSync(9)).replace(/\//g, '')
                };
                console.log(newUser)
                sql.insert('users', newUser).then((result) => {
                    let user = {id: result.insertId}
                    return done(null, user);
                });
            }
        });
      }
    ));

    // =========================================================================
    // TWITTER STRATEGY  =======================================================
    // =========================================================================

    passport.use(new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:3001/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
        // console.log(profile)
        let {id_str, screen_name, name, profile_image_url} = profile._json
        // console.log(id_str + '\n' + screen_name + '\n' + name + '\n' + profile_image_url)
        sql.select('*', 'users', {}, {twitterId: id_str}).then(result => {
            if (Object.keys(result).length > 0) return done(null, result[0]);
            else {
                let newpwd = generatePassword()
                var newUser = {
                    twitterId: id_str,
                    login: screen_name,
                    first_name: capitalizeFirstLetter(name),
                    photo: profile_image_url,
                    psswd: bcrypt.hashSync(newpwd, bcrypt.genSaltSync(9)),
                    token: bcrypt.hashSync('hypertube'+screen_name, bcrypt.genSaltSync(9)).replace(/\//g, ''),
                    email_confirmed: 1
                };
                console.log(newUser)
                sql.insert('users', newUser).then((result) => {
                    let user = {id: result.insertId}
                    return done(null, user);
                });
            }
        })
      }
    ));

    // =========================================================================
    // 42 STRATEGY =============================================================
    // =========================================================================

    passport.use(new FortyTwoStrategy({
        clientID: FORTYTWO_APP_ID,
        clientSecret: FORTYTWO_APP_SECRET,
        callbackURL: "http://localhost:3001/auth/42/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        // console.log(profile)
        let {id, login, first_name, last_name, image_url, email} = profile._json
        // console.log(id + '\n' + login + '\n' + first_name + '\n' + last_name + '\n' + image_url + '\n' + email)
        sql.select('*', 'users', {}, {fortytwoId: id}).then(result => {
            if (Object.keys(result).length > 0) return done(null, result[0]);
            else {
                let newpwd = generatePassword()
                var newUser = {
                    fortytwoId: id,
                    login: login + id,
                    first_name: capitalizeFirstLetter(first_name),
                    last_name: capitalizeFirstLetter(last_name),
                    photo: image_url,
                    email: email,
                    psswd: bcrypt.hashSync(newpwd, bcrypt.genSaltSync(9)),
                    token: bcrypt.hashSync('hypertube'+login, bcrypt.genSaltSync(9)).replace(/\//g, ''),
                    email_confirmed: 1
                };
                console.log(newUser)
                sql.insert('users', newUser).then((result) => {
                    let user = {id: result.insertId}
                    return done(null, user);
                });
            }
        });
      }
    ));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    // Set The Storage Engine
    
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, login, password, done) => {
        let photo;
        if (Object.keys(req.file).length !== 0) {
            photo = '/pics/'+req.file.filename;
        } else photo = '/pics/default.jpg';
        sql.select('*', 'users', {}, {login: login, email: req.body.email}).then(result => {
            if (!isSignUpValid(req, login, password, result)) return done(null, false);
            else {
                var newUser = {
                    login: login,
                    psswd: bcrypt.hashSync(password, bcrypt.genSaltSync(9)),
                    first_name: capitalizeFirstLetter(req.body.first_name),
                    last_name: capitalizeFirstLetter(req.body.last_name),
                    photo,
                    email: req.body.email,
                    token: bcrypt.hashSync('hypertube'+login, bcrypt.genSaltSync(9)).replace(/\//g, '')
                };
                console.log(newUser)
                sql.insert('users', newUser).then(result => {
                    let link = 'http://localhost:3001/confirm/'+newUser.login+'/'+newUser.token
                    let msgtext = "Valider votre compte en vous rendant a cette adresse : "+link
                    let msghtml = "<p>Valider votre compte en "+"<a href="+link+">cliquant ici</a></p>"
                    go("Hypertube", msgtext, msghtml, newUser.email)
                })
            }
        });

        let go = (subj, msgtext, msghtml, towho) => {
            nodemailer.createTestAccount((err, account) => {
            if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
            }
        
            console.log('Credentials obtained, sending message...');
        
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                port: 1025,
                ignoreTLS : true
            });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Hypertube admins 👻" <admins@hypertube.com>', // sender address
                to: towho, // list of receivers
                subject: subj, // Subject line
                text: msgtext, // plain text body
                html: msghtml // html body
            };
        
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                return done(null, null, req.flashAdd('tabSuccess', 'Bravo, finalisez votre compte en cliquant sur le lien que vous venez de recevoir par email!'));
            });
        });
        }
    }))

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-signin',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true, // allows us to pass back the entire request to the callback
        }, (req, login, password, done) => {
            sql.select('*', 'users', {}, {login: login}).then(result => {
                if (Object.keys(result).length < 1) {
                    return done(null, false, req.flashAdd('tabError', 'Cet utilisateur n\'existe pas.'));
                }
                if (result[0].email_confirmed == 0)  return done(null, false, req.flashAdd('tabError', 'L\'email de ce compte n\'a pas encore ete confirme'));
                
                if (!bcrypt.compareSync(password, result[0].psswd)) return done(null, false, req.flashAdd('tabError', 'Oops! Mauvais mot de passe.'));

                return done(null, result[0]);
            })
        })
    );
}

function isSignUpValid (req, login, password, rows) {
    const pwdRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = new RegExp("^[a-zA-Z_]{3,16}$");
    const loginRegex = new RegExp("^[a-zA-Z0-9_]{3,16}$");
    let result = true;

    if (rows.length) {
        req.flashAdd('tabError', 'Ce pseudo/email est deja pris')
        result = false
    }
    if (!loginRegex.test(login)) {
        req.flashAdd('tabError', 'Pseudo: format incorrect')
        result = false
    }
    if (!nameRegex.test(req.body.first_name)) {
        req.flashAdd('tabError', 'first_name: format incorrect')
        result = false
    }
    if (!nameRegex.test(req.body.last_name)) {
        req.flashAdd('tabError', 'last_name: format incorrect')
        result = false
    }
    if (password !== req.body.psswd_confirm) {
        req.flashAdd('tabError', 'Les mots de passe ne correspondent pas.');
        result = false
    }
    if (!pwdRegex.test(password)) {
        req.flashAdd('tabError', 'Mot de passe en carton. ([a-z]+[A-Z]+[0-9])*(6-20)');
        result = false
    }
    if (!emailRegex.test(req.body.email)) {
        req.flashAdd('tabError', 'Syntaxe de l\'email invalide');
        result = false
    }
    if (!isLengthOkay('login', login, req) || !isLengthOkay('first_name', req.body.first_name, req) || !isLengthOkay('last_name', req.body.last_name, req))
        result = false
    return result
}

function isLengthOkay(champs, value, req) {
    let result = true
    console.log(champs+" : "+value.length)
    if (value.length < 3) {
        req.flashAdd('tabError', champs+': trop court');
        result = false
    }
    else if (value.length > 16) {
        req.flashAdd('tabError', champs+': trop long');
        result = false
    }
    return result
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function generatePassword() {
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }