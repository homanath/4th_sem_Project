const { Case, User } = require("../models");

// Helper function for error handling
const handleError = (res, error) => res.status(500).json({ error: error.message });

module.exports = {
  createCase: async (req, res) => {
    try {
      const { caseTitle, details, status, lawyerId, clientId } = req.body;
      const newCase = await Case.create({ caseTitle, details, status, lawyerId, clientId });
      res.status(201).json({ message: "Case created successfully", newCase });
    } catch (error) {
      handleError(res, error);
    }
  },

  getCases: async (req, res) => {
    try {
      const cases = await Case.findAll({ include: [{ model: User, as: "lawyer" }, { model: User, as: "client" }] });
      res.status(200).json(cases);
    } catch (error) {
      handleError(res, error);
    }
  },

  getCaseById: async (req, res) => {
    try {
      const { id } = req.params;
      const caseDetails = await Case.findByPk(id, { include: [{ model: User, as: "lawyer" }, { model: User, as: "client" }] });
      if (!caseDetails) return res.status(404).json({ message: "Case not found" });
      res.status(200).json(caseDetails);
    } catch (error) {
      handleError(res, error);
    }
  },

  updateCase: async (req, res) => {
    try {
      const { id } = req.params;
      const { caseTitle, details, status } = req.body;
      await Case.update({ caseTitle, details, status }, { where: { id } });
      res.status(200).json({ message: "Case updated successfully" });
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteCase: async (req, res) => {
    try {
      const { id } = req.params;
      await Case.destroy({ where: { id } });
      res.status(200).json({ message: "Case deleted successfully" });
    } catch (error) {
      handleError(res, error);
    }
  },
};
