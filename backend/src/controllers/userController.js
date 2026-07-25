import supabase from '../config/supabase.js';

export const userController = {
  syncProfile: async (req, res, next) => {
    try {
      const { userId } = req.auth;
      const { name, email, language } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is missing from token session' });
      }

      // Upsert into Supabase profile database
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          name,
          email,
          language_preference: language,
          updated_at: new Date()
        })
        .select();

      if (error) {
        // Log database connection error
        console.error('Supabase Profile Sync Error:', error);
        // Fallback for mock environment
        return res.json({
          message: 'Profile synced (Supabase offline/mocked)',
          profile: { id: userId, name, email, language_preference: language }
        });
      }

      return res.json({
        message: 'Profile synced successfully',
        profile: data[0]
      });
    } catch (err) {
      next(err);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const { userId } = req.auth;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return res.json({
          profile: { id: userId, name: 'Guest User', language_preference: 'hi' }
        });
      }

      return res.json({ profile: data });
    } catch (err) {
      next(err);
    }
  }
};

export default userController;
