const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

//Login user
module.exports.login = async (req, res) => {
	const candidate = await User.findOne({ email: req.body.email });

	if (candidate) {
		// Check password
		const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
		if (passwordResult) {
			//Generate token.
			const token = jwt.sign({
				email: candidate.email,
				userId: candidate._id
			}, keys.JWT, { expiresIn: 3600 });

			res.status(200).json({
				token: `Bearer ${token}`
			})
		} else {
			res.status(401).json({
				message: 'Password mismatch. Please try again'
			}); // 401 - unauthorised
		}
	} else {
		// User doesn't exists
		res.status(404).json({
			message: "User with this email not found"
		});
	}
}


//Register user
module.exports.register = async (req, res) => {
	const candidate = await User.findOne({ email: req.body.email });

	if (candidate) {
		// If user exists, need to throw error
		res.status(409).json({
			message: 'This email already exists. Try another.'
		}) // 409 - conflict

	} else {
		// Need create user
		const salt = bcrypt.genSaltSync(10);
		const password = req.body.password;

		const user = new User({
			email: req.body.email,
			password: bcrypt.hashSync(password, salt)
		});

		try {
			await user.save();
			res.status(201).json(user); // 201 - created
		} catch (error) {
			errorHandler(res, error);
		}

	}
}