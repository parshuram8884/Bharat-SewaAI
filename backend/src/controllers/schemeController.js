import govApiService from '../services/govApiService.js';

export const schemeController = {
  getSchemes: async (req, res, next) => {
    try {
      const { age, income, state } = req.query;
      const criteria = {
        age: age ? parseInt(age) : null,
        income: income ? parseInt(income) : null,
        state: state || null
      };

      const schemes = await govApiService.fetchSchemes(criteria);
      return res.json({ schemes });
    } catch (err) {
      next(err);
    }
  }
};

export default schemeController;
