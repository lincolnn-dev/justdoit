import type {
  CreateTaskInput,
  ListTasksQuery,
  ListTasksResponse,
  Task,
  ToggleTaskStatusInput,
  UpdateTaskInput,
} from "@justdoit/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.message ?? "Something went wrong";
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return response.json() as Promise<T>;
}

export const tasksApi = {
  list: (query: ListTasksQuery) => {
    const search = new URLSearchParams();

    if (query.status && query.status !== "all") {
      search.set("status", query.status);
    }

    if (query.sortBy) {
      search.set("sortBy", query.sortBy);
    }

    return request<ListTasksResponse>(`/tasks?${search.toString()}`);
  },
  create: (input: CreateTaskInput) =>
    request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateTaskInput) =>
    request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  toggle: (id: string, input: ToggleTaskStatusInput) =>
    request<Task>(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<{ success: boolean }>(`/tasks/${id}`, {
      method: "DELETE",
    }),
};

