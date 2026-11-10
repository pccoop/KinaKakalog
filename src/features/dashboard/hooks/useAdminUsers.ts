import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/features/auth/api/auth-service";
import type {
  AdminCreateUserData,
  AdminUpdateUserData,
  User,
} from "@/features/auth/types";

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;

export function useAdminUsers() {
  return useQuery<User[]>({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: () => authService.getAllUsers(),
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, AdminCreateUserData>({
    mutationFn: (data) => authService.adminCreateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string | number; data: AdminUpdateUserData }>({
    mutationFn: ({ id, data }) => authService.adminUpdateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}

export function useUnblockUserMutation() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string | number>({
    mutationFn: (userId) => authService.adminUnblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}
