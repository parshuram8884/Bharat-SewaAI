import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from './useAuth';

export const useCitizenAppointments = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['citizenAppointments', user?.id],
    queryFn: () => appointmentService.getCitizenAppointments(user.id),
    enabled: !!user
  });
};

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ centreId, serviceId, date, slotId }) => appointmentService.bookAppointment(user.id, centreId, serviceId, date, slotId),
    onSuccess: () => queryClient.invalidateQueries(['citizenAppointments', user?.id])
  });
};

export const useCheckInAppointment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (appointmentId) => appointmentService.checkIn(user.id, appointmentId),
    onSuccess: () => queryClient.invalidateQueries(['citizenAppointments', user?.id])
  });
};
