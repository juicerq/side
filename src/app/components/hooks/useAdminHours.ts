import { api } from "@/trpc/react";

export const useAdminHours = () => {
  const {
    data: hours,
    refetch: refetchHours,
    isLoading: fetchingHours,
  } = api.schedule.hour.getAll.useQuery();

  return {
    hours,
    refetchHours,
    fetchingHours,
  };
};
