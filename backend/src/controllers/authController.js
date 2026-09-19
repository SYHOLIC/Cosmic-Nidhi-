const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendVerificationOTP } = require('../services/emailService');

// @desc    Register user and send verification OTP
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail });

    // If user exists and is already verified
    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please sign in.',
      });
    }

    // Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user && !user.isVerified) {
      // Re-registering unverified account: update details & new OTP
      user.name = name;
      user.password = password;
      user.phone = phone;
      user.dateOfBirth = dateOfBirth;
      user.timeOfBirth = timeOfBirth;
      user.placeOfBirth = placeOfBirth;
      user.verificationOTP = otp;
      user.verificationOTPExpires = otpExpires;
      await user.save();
    } else {
      // Create new user with isVerified = false
      user = await User.create({
        name,
        email: normalizedEmail,
        password,
        phone,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        isVerified: false,
        verificationOTP: otp,
        verificationOTPExpires: otpExpires,
      });
    }

    // Send the verification OTP email via SendGrid
    try {
      await sendVerificationOTP(normalizedEmail, name, otp);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification code. Please check that your email address is correct.',
      });
    }

    res.status(200).json({
      success: true,
      requiresVerification: true,
      email: normalizedEmail,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}. Please enter it to complete registration.`,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

// @desc    Verify registration OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    if (user.isVerified) {
      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        message: 'Email is already verified. Logging you in...',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          cart: user.cart || [],
        },
      });
    }

    // Validate OTP
    if (!user.verificationOTP || user.verificationOTP !== otp.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.',
      });
    }

    // Check expiration
    if (new Date() > new Date(user.verificationOTPExpires)) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please click "Resend Code" to receive a new one.',
      });
    }

    // Mark as verified & clear OTP
    user.isVerified = true;
    user.verificationOTP = null;
    user.verificationOTPExpires = null;
    await user.save();

    // Generate JWT auth token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to Cosmic Nidhi.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        cart: user.cart || [],
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Verification failed',
    });
  }
};

// @desc    Resend registration OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Your email is already verified. Please sign in.',
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = otp;
    user.verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendVerificationOTP(normalizedEmail, user.name, otp);

    res.status(200).json({
      success: true,
      message: `A new 6-digit code has been sent to ${normalizedEmail}.`,
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to resend code',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // If regular user is not verified, require verification
    if (!user.isVerified && user.role !== 'admin') {
      // Generate fresh OTP and send
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationOTP = otp;
      user.verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      try {
        await sendVerificationOTP(normalizedEmail, user.name, otp);
      } catch (err) {
        console.error('Failed to send OTP during login:', err.message);
      }

      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: normalizedEmail,
        message: 'Your email is not verified yet. We have sent a 6-digit verification code to your inbox.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        cart: user.cart || [],
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { register, verifyOTP, resendOTP, login, getMe };