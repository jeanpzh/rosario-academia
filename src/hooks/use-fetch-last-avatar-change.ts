import { getLastAvatarDate } from "@/app/dashboard/actions/athleteActions";
import { useQuery } from "@tanstack/react-query";

export function useFetchLastAvatarChangeQuery({
  setLastAvatarChange,
}: {
  setLastAvatarChange: any;
}) {
  return useQuery({
    queryKey: ["last-avatar-change"],
    queryFn: async () => {
      const res = await getLastAvatarDate();
      // Guarda la fecha en el estado global
      setLastAvatarChange(res.data);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
