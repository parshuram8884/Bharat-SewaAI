import { useAdminAuth } from '../context/AdminAuthContext';
import { getTranslation } from '../utils/translations';

export function useTranslation() {
  const { user, updateUserProfile } = useAdminAuth();
  const currentLang = user?.language || 'English';

  const t = (key) => getTranslation(key, currentLang);

  const setLanguage = async (newLang) => {
    await updateUserProfile({ language: newLang });
  };

  return { t, currentLang, setLanguage };
}
export default useTranslation;
