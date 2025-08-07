import axios from 'axios';

export const getTodos = async () => {
  const res = await axios.get("http://localhost:5000/api/todos");
  return res.data;
};