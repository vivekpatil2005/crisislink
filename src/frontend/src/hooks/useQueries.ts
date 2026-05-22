import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SOSAlert, SafeZone } from "../backend";
import { useActor } from "./useActor";

export function useGetSafeZones() {
  const { actor, isFetching } = useActor();
  return useQuery<SafeZone[]>({
    queryKey: ["safeZones"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSafeZones();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetLatestAlerts() {
  const { actor, isFetching } = useActor();
  return useQuery<SOSAlert[]>({
    queryKey: ["sosAlerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLatestAlerts();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useSubmitSOS() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      message,
      latitude,
      longitude,
    }: {
      name: string;
      message: string;
      latitude: number;
      longitude: number;
    }) => {
      if (!actor) throw new Error("No actor available");
      return actor.submitSos(name, message, latitude, longitude);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sosAlerts"] });
    },
  });
}
