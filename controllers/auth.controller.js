const User = require('../models/user.model.js');

const home = async (req, res) => {
  try {
    res.status(200).send('This is a home page from controller file');
  } catch (error) {
    console.error(error);
  }
};

/*
 * User Registration
 */
const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const userCreated = await User.create({ username, email, phone, password });

    res.status(201).json({
      msg: 'Registration Successful',
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

/*
 * User Login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await userExist.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    res.status(200).json({
      msg: 'Login Successful',
      token: await userExist.generateToken(),
      userId: userExist._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { home, register, login };
