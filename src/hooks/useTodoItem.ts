import { useEffect, useState } from "react";
import type { Todo } from "../models/todo";
import { useTodoStore } from "../store/todo.store";

interface TodoItemProps {
  todo: Todo;
}

export function useTodoItem({ todo }: TodoItemProps) {
  const [editable, setEditable] = useState(false);
  const [input, setInput] = useState("");

  const handleUpdateTodo = useTodoStore((state) => state.handleUpdateTodo);
  const handleDeleteTodo = useTodoStore((state) => state.handleDeleteTodo);
  const handleCompleteChange = useTodoStore(
    (state) => state.handleCompleteChange
  );

  useEffect(() => {
    setInput(todo.title);
  }, [todo]);

  function toggleEdit() {
    setEditable(!editable);
  }

  function onUpdateTodo() {
    const updatedTodo: Todo = {
      ...todo,
      title: input,
    };
    handleUpdateTodo(updatedTodo);
  }

  function onDeleteTodo(id: string) {
    handleDeleteTodo(id);
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Escape":
        toggleEdit();
        break;

      case "Enter":
        toggleEdit();
        onUpdateTodo();
        break;
      default:
        break;
    }
  }

  function onCompleteChange(id: string, completed: boolean) {
    handleCompleteChange(id, completed);
  }

  return {
    editable,
    input,
    setInput,
    handleKeyUp,
    toggleEdit,
    onDeleteTodo,
    onCompleteChange,
  };
}
