const router = require('express').Router();

const authService = require('../services/authService');
const { COOKIE_SESSION_NAME } = require('../constants');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');

router.get('/login', isGuest, async (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
   const { username, password } = req.body;
   
   if(!username || !password) {
    return res.render('auth/login', {error: 'Both fields are required!'});
   }

   try {
        const user = await authService.login(username, password);
        const token = await authService.createToken(user);

        res.cookie(COOKIE_SESSION_NAME, token, { httpOnly:true });
        res.redirect('/');

    } catch(error) {
        return res.render('auth/login', { error: getErrorMessage(error) });
    }
});

router.get('/register', isGuest, async (req, res) => {
   res.render('auth/register');      
});

router.post('/register', isGuest, async (req, res) => {
    const { username, password, repeatPassword, address } = req.body;
    
    if(password !== repeatPassword) {
        return res.render('auth/register', { error: 'Passwords do not match!' });
    }

    try {
        const createdUser = await authService.create({ username, password, address });
        const token = await authService.createToken(createdUser);

        res.cookie(COOKIE_SESSION_NAME, token, { httpOnly:true });
        res.redirect('/');

    } catch(error) {
        return res.render('auth/register', { error: getErrorMessage(error) });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(COOKIE_SESSION_NAME);
    res.redirect('/');
});

module.exports = router;


