const express = require('express');
const userController = require('../controllers/user');
const { verify, isLoggedIn } = require("../auth");
const passport = require('passport');

const router = express.Router();



router.post("/check-email", userController.checkEmailExists);

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

//Route for initiating the Google OAuth Consent Screen
router.get('/google',
	//verify the email credentials in google API
		passport.authenticate('google', {
			// what are allowed when retrieving data
			scope: ['email', 'profile'],
			//added option for accounts
			prompt: "select_account"
		})
	)

//Route for callback URL for authentication
router.get('/google/callback',
		//if failed 
		passport.authenticate('google', {
			failureRedirect: '/users/failed',
		}),
		//if success
		function (req, res){
			res.redirect('/users/success')
		}
	)

//Route for failed authentication
router.get('/failed', (req, res) => {
	console.log('User is not authenticated');
	res.send("Failed")
})

// Route for successful authentication
router.get('/success', isLoggedIn, (req, res) => {
	console.log('You are logged in');
	console.log(req.user);
	res.send(`Welcome ${req.user.displayName}`)
})

// Route for logging out
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err){
			console.log('Error while destroying the session: ', err);
		} else {
			req.logout(() => {
				console.log('You are logged out');
				//cannot GET because we dont have a home route
				res.redirect('/');
			});
		}
	});
});
module.exports = router;