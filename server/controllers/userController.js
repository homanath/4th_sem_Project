const { User, Case } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const userController = {
  // Existing methods
  register: async (req, res) => {
    try {
      const { name, email, password, role = 'lawyer' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Email already registered' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        status: 'active'
      });

      // Generate token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from response
      const { password: _, ...userData } = user.get({ plain: true });

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: userData,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Registration failed',
        error: error.message 
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ 
        where: { email },
        attributes: { include: ['password'] }
      });

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from response
      const { password: _, ...userData } = user.get({ plain: true });

      res.json({
        success: true,
        user: userData,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Login failed',
        error: error.message 
      });
    }
  },

  logout: async (req, res) => {
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      res.json(user);
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, email, mobile, address } = req.body;
      
      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        where: { 
          email,
          id: { [Op.ne]: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const updateData = {
        name,
        email,
        mobile,
        address
      };

      // Handle profile picture upload if present
      if (req.file) {
        // Assuming you're using multer for file uploads
        const profilePicture = `/uploads/profiles/${req.file.filename}`;
        updateData.profilePicture = profilePicture;
      }

      // Update user
      await User.update(updateData, {
        where: { id: userId }
      });

      // Get updated user data
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  },

  updateProfileImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      await User.update(
        { imageUrl },
        { where: { id: req.user.id } }
      );
      res.json({ imageUrl });
    } catch (error) {
      console.error("Update profile image error:", error);
      res.status(500).json({ error: "Failed to update profile image" });
    }
  },

  // Client management methods
  getClients: async (req, res) => {
    try {
      const clients = await User.findAll({
        where: {
          role: 'client',
          lawyerId: req.user.id
        },
        attributes: { exclude: ['password'] }
      });

      res.json(clients);
    } catch (error) {
      console.error('Error in getClients:', error);
      res.status(500).json({ 
        message: 'Failed to fetch clients',
        error: error.message 
      });
    }
  },

  getClientById: async (req, res) => {
    try {
      const client = await User.findOne({
        where: {
          id: req.params.id,
          role: 'client',
          lawyerId: req.user.id
        },
        attributes: ['id', 'name', 'email', 'mobile', 'status', 'address'],
        include: [{
          model: Case,
          as: 'clientCases',
          attributes: ['id'],
          required: false
        }]
      });

      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      const transformedClient = {
        ...client.get({ plain: true }),
        caseCount: client.clientCases?.length || 0,
        clientCases: undefined
      };

      res.json(transformedClient);
    } catch (error) {
      console.error('Error in getClientById:', error);
      res.status(500).json({ message: 'Failed to fetch client details' });
    }
  },

  createClient: async (req, res) => {
    try {
      const { name, email, password, mobile, address } = req.body;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const client = await User.create({
        name,
        email,
        password: hashedPassword,
        mobile,
        address,
        role: 'client',
        status: 'active',
        lawyerId: req.user.id
      });

      const { password: _, ...clientData } = client.get({ plain: true });
      res.status(201).json({ 
        message: 'Client created successfully',
        client: clientData
      });
    } catch (error) {
      console.error('Error in createClient:', error);
      res.status(500).json({ message: 'Failed to create client' });
    }
  },

  updateClientStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Verify the client belongs to the lawyer
      const client = await User.findOne({
        where: {
          id,
          role: 'client',
          lawyerId: req.user.id
        }
      });

      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      // Update status
      await client.update({ status });

      res.json({
        message: 'Client status updated successfully',
        status: client.status
      });
    } catch (error) {
      console.error('Error updating client status:', error);
      res.status(500).json({ message: 'Failed to update client status' });
    }
  },

  // Admin methods
  getPendingLawyers: async (req, res) => {
    try {
      const pendingLawyers = await User.findAll({
        where: {
          role: 'lawyer',
          status: 'pending'
        },
        attributes: ['id', 'name', 'email', 'mobile', 'createdAt']
      });

      res.json(pendingLawyers);
    } catch (error) {
      console.error("Get pending lawyers error:", error);
      res.status(500).json({ error: "Failed to fetch pending lawyers" });
    }
  },

  approveLawyer: async (req, res) => {
    try {
      const { id } = req.params;
      const lawyer = await User.findOne({
        where: {
          id,
          role: 'lawyer',
          status: 'pending'
        }
      });

      if (!lawyer) {
        return res.status(404).json({ error: "Lawyer not found or already approved" });
      }

      await lawyer.update({ status: 'active' });
      res.json({ message: "Lawyer approved successfully" });
    } catch (error) {
      console.error("Approve lawyer error:", error);
      res.status(500).json({ error: "Failed to approve lawyer" });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findByPk(req.user.id);
      
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error in updatePassword:', error);
      res.status(500).json({ message: 'Failed to update password' });
    }
  },

  updateProfilePicture: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const userId = req.user.id;
      const profilePicture = `/uploads/profiles/${req.file.filename}`;

      // Update user profile picture
      await User.update(
        { profilePicture },
        { where: { id: userId } }
      );

      // Get updated user data
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Profile picture update error:', error);
      res.status(500).json({ message: 'Failed to update profile picture' });
    }
  }
};

module.exports = userController;
