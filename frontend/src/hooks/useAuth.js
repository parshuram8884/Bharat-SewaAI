import { officerAuthService } from '../services/officerAuthService';

export function useAuth() {
  // For the Officer/Admin portals, we pull from the mocked auth service.
  // In a real app this would use Clerk for citizens and custom auth for officers.
  // Here we just return the currently logged in officer if any, 
  // or a dummy citizen if none is logged in.
  
  const officerUser = officerAuthService.getCurrentUser();
  
  if (officerUser) {
    return {
      user: officerUser,
      isLoaded: true,
      isSignedIn: true
    };
  }

  // Fallback for Citizen Portal in Phase 10 mockup
  return {
    user: {
      id: 'citizen-123',
      name: 'Rahul Sharma',
      role: 'citizen'
    },
    isLoaded: true,
    isSignedIn: true
  };
}
