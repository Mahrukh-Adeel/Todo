import {model, Schema, Document} from 'mongoose';

interface Todo extends Document{
    text: string;
    completed:boolean;
}
const TodoSchema= new Schema<Todo>({
    text:{type:String, required:true},
    completed: {type:Boolean, required:true}
})

export default model<Todo>('Todo', TodoSchema);