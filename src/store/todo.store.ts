import { create } from "zustand";
import type { Todo } from "../models/todo";
import type { Tab } from "../models/tab";
import { todoApi } from "../services/todoApi";

interface TodoState {
  todos: Todo[];
  filterType: Tab;
  loading: boolean;
  handleChangeFilterType: (tab: Tab) => void;
  fetchTodos: () => Promise<void>;
  handleAddTodo: (title: string) => Promise<void>;
  countActiveItems: () => number;
  handleCompleteAllItems: () => Promise<void>;
  handleUpdateTodo: (updatedTodo: Todo) => Promise<void>;
  handleDeleteTodo: (id: string) => Promise<void>;
  handleCompleteChange: (id: string, completed: boolean) => Promise<void>;
  handleDeleteAllCompleted: () => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  filterType: "all",
  loading: false,

  countActiveItems: () => get().todos.filter((todo) => !todo.completed).length,

  handleChangeFilterType: (tab) => set({ filterType: tab }),

  fetchTodos: async () => {
    set({ loading: true });
    try {
      const todos = await todoApi.getAll();
      set({ todos });
    } finally {
      set({ loading: false });
    }
  },

  handleAddTodo: async (title) => {
    const newTodo = await todoApi.create(title);
    set((state) => ({ todos: [...state.todos, newTodo] }));
  },

  handleCompleteAllItems: async () => {
    const { todos } = get();
    const allCompleted = todos.every((t) => t.completed);
    const shouldCompleteAll = !allCompleted;
    await todoApi.completeAll(shouldCompleteAll);
    set({ todos: todos.map((t) => ({ ...t, completed: shouldCompleteAll })) });
  },

  handleUpdateTodo: async (updatedTodo) => {
    await todoApi.update(updatedTodo);
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === updatedTodo.id ? { ...t, ...updatedTodo } : t
      ),
    }));
  },

  handleDeleteTodo: async (id) => {
    await todoApi.delete(id);
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
  },

  handleCompleteChange: async (id, completed) => {
    await todoApi.patchComplete(id, completed);
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, completed } : t)),
    }));
  },

  handleDeleteAllCompleted: async () => {
    await todoApi.deleteCompleted();
    set((state) => ({ todos: state.todos.filter((t) => !t.completed) }));
  },
}));
