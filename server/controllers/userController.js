const { User } = require("../models");

// Helper function for error handling
const handleError = (res, error) => res.status(500).json({ error: error.message });

module.exports = {
  createUser: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const user = await User.create({ name, email, password, role });
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      handleError(res, error);
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      handleError(res, error);
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      handleError(res, error);
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;
      const user = await User.update({ name, email, role }, { where: { id } });
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await User.destroy({ where: { id } });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      handleError(res, error);
    }
  },
};
