const { User, Case } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const clientController = {
  getClients: async (req, res) => {
    try {
      // Verify lawyer role
      if (req.user.role !== 'lawyer') {
        return res.status(403).json({ 
          message: 'Access denied. Lawyer only.' 
        });
      }

      const clients = await User.findAll({
        where: {
          role: 'client',
          lawyerId: req.user.id
        },
        attributes: [
          'id',
          'name',
          'email',
          'mobile',
          'status',
          'createdAt'
        ],
        include: [{
          model: Case,
          as: 'clientCases',
          attributes: ['id'],
          required: false
        }],
        order: [['createdAt', 'DESC']]
      });

      // Transform the data to include case count
      const transformedClients = clients.map(client => ({
        ...client.toJSON(),
        caseCount: client.clientCases ? client.clientCases.length : 0
      }));

      res.json(transformedClients);
    } catch (error) {
      console.error('Error in getClients:', error);
      res.status(500).json({ 
        message: 'Failed to fetch clients',
        error: error.message 
      });
    }
  },

  createClient: async (req, res) => {
    try {
      const { name, email, mobile, address } = req.body;

      // Check if email already exists
      const existingClient = await User.findOne({ 
        where: { email } 
      });

      if (existingClient) {
        return res.status(400).json({ 
          message: 'Email already registered' 
        });
      }

      // Generate random password
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);

      const client = await User.create({
        name,
        email,
        mobile,
        address,
        password: hashedPassword,
        role: 'client',
        lawyerId: req.user.id,
        status: 'active'
      });

      // Remove password from response
      const { password: _, ...clientData } = client.toJSON();
      
      res.status(201).json(clientData);
    } catch (error) {
      console.error('Error in createClient:', error);
      res.status(500).json({ 
        message: 'Failed to create client',
        error: error.message 
      });
    }
  },

  updateClientStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

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

      await client.update({ status });
      res.json({ 
        message: 'Status updated successfully',
        status: client.status 
      });
    } catch (error) {
      console.error('Error in updateClientStatus:', error);
      res.status(500).json({ 
        message: 'Failed to update status',
        error: error.message 
      });
    }
  }
};

module.exports = clientController; 