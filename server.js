const express		=	require("express");
const app			=	express();
const http			=	require('http');
const path			=	require('path');
const bodyParser	=	require('body-parser');
const passport = require('passport');
const database		=	require('./Model/SQL.class.js');
const session       =	require('express-session');
const cookieParser 	=	require('cookie-parser');

require('./private/passport')(passport)

const index 		=	require('./Controllers/index.js');
const signin		=	require('./Controllers/signin.js');
const signup	=	require('./Controllers/signup.js');
const forgot_pwd	=	require('./Controllers/forgot_pwd.js');
const profile	=	require('./Controllers/profile.js');
const modify_profile	=	require('./Controllers/modify_profile.js');
const logout	=	require('./Controllers/logout.js');
const confirm	=	require('./Controllers/confirm.js');
const user	=	require('./Controllers/user.js');

// const port = 8080;
// const hostname = '127.0.0.1';

app.set('views', path.join(__dirname, './public/views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(require('./private/middlewares/flash'))

app.use('/', index(passport));
app.use('/signin', signin(passport));
app.use('/signup', signup(passport));
app.use('/confirm', confirm);
app.use('/forgot_pwd', forgot_pwd);
app.use('/modify_profile', isLoggedIn, modify_profile);
app.use('/profile', isLoggedIn, profile(passport));
app.use('/user', isLoggedIn, user(passport));
app.use('/logout', isLoggedIn, logout);

http.createServer(app).listen(3001);
// app.listen(port, hostname, () => {
// 	console.log(`Server running at http://${hostname}:${port}/`);
// });

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}