import { useQuery } from '@tanstack/react-query';
import { cscService } from '../services/cscService';

export const useCscCentres = () => useQuery({
  queryKey: ['cscCentres'],
  queryFn: () => cscService.getCentres()
});

export const useCscServices = () => useQuery({
  queryKey: ['cscServices'],
  queryFn: () => cscService.getServices()
});

export const useCscAvailability = (centreId, serviceId, date) => useQuery({
  queryKey: ['cscAvailability', centreId, serviceId, date],
  queryFn: () => cscService.checkAvailability(centreId, serviceId, date),
  enabled: !!centreId && !!serviceId && !!date
});
