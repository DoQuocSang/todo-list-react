import type { Todo } from "../models/todo";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/todos`;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const todoApi = {
  getAll: (): Promise<Todo[]> => request(BASE_URL),

  create: (title: string): Promise<Todo> =>
    request(BASE_URL, {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  update: (todo: Todo): Promise<void> =>
    request(`${BASE_URL}/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify({ title: todo.title, completed: todo.completed }),
    }),

  patchComplete: (id: string, completed: boolean): Promise<void> =>
    request(`${BASE_URL}/${id}/complete`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    }),

  completeAll: (completed: boolean): Promise<void> =>
    request(`${BASE_URL}/complete-all`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    }),

  delete: (id: string): Promise<void> =>
    request(`${BASE_URL}/${id}`, { method: "DELETE" }),

  deleteCompleted: (): Promise<void> =>
    request(`${BASE_URL}/completed`, { method: "DELETE" }),
};
