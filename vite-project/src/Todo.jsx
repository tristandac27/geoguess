import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import './Todo.css';

const Todo = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState("");

  // Sauvegarder les todos dans le Local Storage à chaque mise à jour
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() !== "") {
      setTodos([...todos, { text: input, completed: false, editing: false }]);
      setInput("");
    }
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const toggleComplete = (index) => {
    const newTodos = todos.map((todo, i) =>
      i === index
        ? {
            ...todo,
            completed: !todo.completed,
            style: todo.completed ? "text-red-500" : "text-green-500",
          }
        : todo
    );
    setTodos(newTodos);
  };

  const editTodo = (index) => {
    const newTodos = todos.map((todo, i) =>
      i === index ? { ...todo, editing: !todo.editing } : todo
    );
    setTodos(newTodos);
  };

  const updateTodo = (index, newText) => {
    const newTodos = todos.map((todo, i) =>
      i === index ? { ...todo, text: newText, editing: false } : todo
    );
    setTodos(newTodos);
  };

  return (
    <div className="p-5 max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg">
      <motion.h1
        className="text-xl font-bold mb-3 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Todo App avec Local Storage
      </motion.h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-1 rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <motion.button
          className="bg-blue-500 text-white p-2 rounded-lg shadow-md"
          onClick={addTodo}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Ajouter
        </motion.button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <motion.li
            key={index}
            className={`p-2 mb-2 flex justify-between items-center border rounded-lg shadow-md bg-white transition-all duration-300 ${
              todo.completed ? "line-through opacity-50 bg-green-100" : ""
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(index)}
              className="mr-2 cursor-pointer"
            />
            {todo.editing ? (
              <input
                type="text"
                className="border p-1 rounded-lg"
                defaultValue={todo.text}
                onBlur={(e) => updateTodo(index, e.target.value)}
              />
            ) : (
              <span
                className={`cursor-pointer text-lg font-medium transition-all duration-300 ${
                  todo.completed ? "text-green-500" : "text-red-500"
                }`}
                onClick={() => toggleComplete(index)}
              >
                {todo.text}
              </span>
            )}
            <div className="flex gap-2">
              <motion.button
                className="text-yellow-500 text-lg"
                onClick={() => editTodo(index)}
                whileHover={{ scale: 1.2 }}
              >
                ✏️
              </motion.button>
              <motion.button
                className="text-red-500 text-lg"
                onClick={() => deleteTodo(index)}
                whileHover={{ scale: 1.2 }}
              >
                ❌
              </motion.button>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
