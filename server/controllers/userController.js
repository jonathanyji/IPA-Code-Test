const User = require('../models/userModel');
const { body, validationResult } = require('express-validator');

exports.register = [
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),

    async (req, res) => {
        console.log("Register is called");
        const { name, email } = req.body;
        console.log("AAAAd: ", name);
        console.log("AAAAd: ", email);

        try {
            const existingUser = await User.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            const userId = await User.createUser( name, email );
    
            res.status(201).json({ message: 'User created successfully', userId });
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
];

exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(200).json({ message: 'User not found' });
    }

    res.status(200).json({ name: user.name, email: user.email });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ name: user.name, email: user.email });
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };