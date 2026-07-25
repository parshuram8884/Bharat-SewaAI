export const govApiService = {
  /**
   * Fetches latest schemes matching eligibility parameters
   * @param {Object} criteria - User criteria (age, state, category, income)
   */
  fetchSchemes: async (criteria) => {
    // In a real application, you'd fetch from actual government open data platforms
    // For scaffolding, we return a predefined set of key schemes.
    const allSchemes = [
      {
        id: 'pm-awas',
        name: 'Pradhan Mantri Awas Yojana',
        description: 'Affordable housing scheme for urban and rural poor.',
        eligibility: { minAge: 18, maxIncome: 600000 },
        benefits: 'Financial assistance for home construction.'
      },
      {
        id: 'ayushman-bharat',
        name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
        description: 'National health insurance scheme for low-income citizens.',
        eligibility: { minAge: 0, maxIncome: 250000 },
        benefits: 'Health coverage up to 5 Lakhs per family per year.'
      }
    ];

    // Simple filters
    return allSchemes.filter(scheme => {
      if (criteria.income && scheme.eligibility.maxIncome && criteria.income > scheme.eligibility.maxIncome) {
        return false;
      }
      return true;
    });
  }
};

export default govApiService;
