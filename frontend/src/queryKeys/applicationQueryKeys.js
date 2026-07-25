export const applicationQueryKeys = {
  all: ['applications'],
  lists: () => [...applicationQueryKeys.all, 'list'],
  list: (filters) => [...applicationQueryKeys.lists(), { filters }],
  details: () => [...applicationQueryKeys.all, 'detail'],
  detail: (id) => [...applicationQueryKeys.details(), id]
};
