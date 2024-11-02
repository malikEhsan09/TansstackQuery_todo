import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styles from "./Form.module.css";

const createTodo = async (text) => {
  const response = await fetch("http://localhost:8800/todo/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: text }),
  });
  if (!response.ok) {
    throw new Error("Failed to create todo");
  }
  return response.json();
};

const Form = () => {
  const [text, setText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();

  const todoMutation = useMutation({
    mutationFn: () => createTodo(text),
    onSuccess: () => {
      setShowSuccess(true);
      setText("");

      // Refetch the todos after a new one is added
      queryClient.invalidateQueries(["todo"]);

      setTimeout(() => setShowSuccess(false), 2000);
    },
    onError: (error) => {
      console.error("Error creating todo:", error.message);
    },
  });

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && text.trim()) {
      todoMutation.mutate();
    }
  };

  return (
    <div className={styles.formContainer}>
      {showSuccess && (
        <div className={styles.successMessage}>Todo created successfully!</div>
      )}

      <input
        type="text"
        placeholder="Enter todo text"
        className={styles.input}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        value={text}
      />
      <button
        className={styles.button}
        onClick={() => {
          if (text.trim()) {
            todoMutation.mutate();
          } else {
            alert("Please enter a todo text");
          }
        }}
      >
        Create Todo
      </button>
    </div>
  );
};

export default Form;
