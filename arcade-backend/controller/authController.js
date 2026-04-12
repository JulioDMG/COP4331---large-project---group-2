const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../Verification');

//generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.NODE_ENV === 'production' ? '1h' : '24h'
  });
};

//register User
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    const user = await User.create({ username, email, password });

    const userResponse = user.toObject();
    delete userResponse.password;

    const token = generateToken(user._id);

    //"data:" key
    try {
      await sendVerificationEmail(user.email);
    } catch (emailErr) {
      console.error('[Register] Verification email failed:', emailErr);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: userResponse, token }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

//login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: userResponse, token }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'ourSecretKey');
    const user = await User.findOneAndUpdate(
      { email: payload.email },
      { verified: true },
      { new: true }           // return the updated document
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found.' });

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.NODE_ENV === 'production' ? '1h' : '24h'
    });

    res.json({
      message: 'Email verified successfully.',
      data: { token: authToken, user }
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired verification link.' });
  }
};
