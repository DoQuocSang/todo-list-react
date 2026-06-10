import { useTodoStore } from "../store/todo.store";

export default function useTodo() {
  const todos = useTodoStore((state) => state.todos);
  const filterType = useTodoStore((state) => state.filterType);

  const getFilteredTodos = () => {
    switch (filterType) {
      case "all":
        return todos;
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
    }
  };

  return {
    todos,
    getFilteredTodos,
  };
}
