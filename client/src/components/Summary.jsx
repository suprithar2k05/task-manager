const Summary = ({ tasks }) => {
   const total = tasks.length
   const completed = tasks.filter(t => t.status === 'Completed').length
   const pending = total - completed
 
   return (
     <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
       <div className="bg-blue-100 p-4 rounded shadow">Total Tasks: {total}</div>
       <div className="bg-green-100 p-4 rounded shadow">Completed: {completed}</div>
       <div className="bg-yellow-100 p-4 rounded shadow">Pending: {pending}</div>
     </div>
   )
 }
 
 export default Summary
 