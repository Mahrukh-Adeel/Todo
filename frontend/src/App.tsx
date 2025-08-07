import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import type { Todo } from "./types/todo";
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(()=>{
    axios.get("http://localhost:5001/api/todos")
      .then(res => setTodos(res.data))
      .catch(error => console.log(error));
  },[])

  const handleAddTodo = async () => {
    if (input.trim() === "") return;
    const newTodo: Omit<Todo, "_id"> = {
      text: input,
      completed: false,
    };
    try{
      const res = await axios.post("http://localhost:5001/api/todos", newTodo);
      setTodos([...todos, res.data]);
      setInput("");
    } catch (error){
      console.error("Error adding todo:", error);
    }
  };

  const handleToggle = async (id: string) => {
    const todoToUpdate = todos.find((todo)=> todo._id === id);
    if (!todoToUpdate) return
    try{
      const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed }
      const res = await axios.patch(`http://localhost:5001/api/todos/${id}`, {
        completed: updatedTodo.completed,
      });
      setTodos(
      todos.map((todo) =>
        todo._id === id ? res.data : todo
      )
    );
    } catch (error){
      console.error("Failed to update todo", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleEdit = async (id: string, newText: string) => {
    const todoToUpdate = todos.find((todo)=> todo._id === id);
    if (!todoToUpdate) return
     try{
      const updatedTodo = { ...todoToUpdate, text: newText }
      const res = await axios.patch(`http://localhost:5001/api/todos/${id}`, {
        text: updatedTodo.text,
      });
      setTodos(
      todos.map((todo) =>
        todo._id === id ? res.data : todo
      )
    );
    } catch (error){
      console.error("Failed to update todo", error)
    }
  };

  return (
    <div className="p-4 w-full h-screen bg-rose-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-pink-800 text-center"> Todo App</h1>
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-pink-300 px-2 py-1 flex-grow rounded focus:border-pink-400"
            placeholder="Add a new todo"
          />
          <button 
            onClick={handleAddTodo} 
            className="bg-pink-500 text-white px-4 py-1 rounded border border-pink-600 font-bold hover:bg-pink-600"
          >
            Add
          </button>
        </div>
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}

export default App;