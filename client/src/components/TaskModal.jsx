import React from 'react'
import Modal from 'react-modal'
import TaskForm from './TaskForm'

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 max-w-md mx-auto mt-24 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">{task ? 'Edit Task' : 'New Task'}</h2>
      
      <TaskForm
        initialData={task}
        onSubmit={(formData) => {
          formData.tags = formData.tag.split(',').map(el => el.trim());
          onSave(formData)
          onClose()
        }}
        onCancel={onClose}
      />
    </Modal>
  )
}

export default TaskModal
