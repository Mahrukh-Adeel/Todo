import express from 'express';
import Todo from "../models/Todo"
const router= express.Router();

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});


router.post("/", async(req,res)=>{
    try{
        const{text}= req.body;
        const newTodo= new Todo ({text, completed:false});
        await newTodo.save();
        res.json(newTodo);
    } catch(e){
        res.status(400).json({ error: "Failed to create todo" });
    }
})

router.patch("/:id", async (req, res) => {
  try {
    const { completed, text } = req.body;
    const updateData: any = {};
    
    if (completed !== undefined) updateData.completed = completed;
    if (text !== undefined) updateData.text = text.trim();
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    
    res.json(updatedTodo);
  } catch (e) {
    res.status(400).json({ error: "Failed to update todo" });
  }
});

router.put("/:id", async (req, res)=>{
    try{
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.json(updatedTodo);
    } catch( e){
        res.status(400).json({ error: "Failed to update todo" });
    }
})

router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete todo" });
  }
});

export default router;