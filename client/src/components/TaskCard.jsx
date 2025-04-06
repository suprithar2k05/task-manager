const TaskCard = ({ task, onEdit, onDelete }) => {
   return (
     <div className="border p-4 rounded shadow bg-white flex justify-between items-start">
       <div>
         <h3 className="text-lg font-semibold">{task.title}</h3>
         <p className="text-sm text-gray-600">{task.category} | {task.priority}</p>
         <p className={`text-xs mt-1 ${task.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
           {task.status}
         </p>
         <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
       </div>
       <div className="space-x-2">
         <button onClick={() => onEdit(task)} className="text-blue-500">Edit</button>
         <button onClick={() => onDelete(task._id)} className="text-red-500">Delete</button>
       </div>
     </div>
   )
 }
 
 export default TaskCard
 