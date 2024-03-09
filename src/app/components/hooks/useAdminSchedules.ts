import { api } from "@/trpc/react";

export const useAdminSchedules = () => {
  const {
    data,
    isLoading: fetchingSchedules,
    refetch: refetchSchedules,
  } = api.schedule.getAllWithOptions.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return {
    data,
    fetchingSchedules,
    refetchSchedules,
  };
};
