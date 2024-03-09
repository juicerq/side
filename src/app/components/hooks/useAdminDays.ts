import { api } from "@/trpc/react";

export const useAdminDays = () => {
  const {
    data: days,
    isLoading: fetchingDays,
    refetch: refetchDays,
  } = api.schedule.day.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return {
    days,
    refetchDays,
    fetchingDays,
  };
};
