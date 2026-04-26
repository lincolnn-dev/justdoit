"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskInput, ListTasksQuery, ToggleTaskStatusInput, UpdateTaskInput } from "@justdoit/shared";
import { tasksApi } from "../../lib/api";

function tasksKey(query: ListTasksQuery) {
  return ["tasks", query] as const;
}

export function useTasks(query: ListTasksQuery) {
  return useQuery({
    queryKey: tasksKey(query),
    queryFn: () => tasksApi.list(query),
  });
}

export function useCreateTask(query: ListTasksQuery) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksKey(query) });
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask(query: ListTasksQuery) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) => tasksApi.update(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksKey(query) });
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useToggleTask(query: ListTasksQuery) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ToggleTaskStatusInput }) => tasksApi.toggle(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksKey(query) });
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask(query: ListTasksQuery) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tasksKey(query) });
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

