import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [taskDay, setTaskDay] = useState('Today');
  const [taskPriority, setTaskPriority] = useState('1');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      setTasks(prevTasks => [...prevTasks, { 
        id: Date.now().toString(), 
        content: newTask.trim(),
        day: taskDay,
        priority: taskPriority
      }]);
      setNewTask('');
      setTaskDay('Today');
      setTaskPriority('1');
    }
  }, [newTask, taskDay, taskPriority]);

  const removeTask = useCallback((id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = useCallback((e, targetDay) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, day: targetDay } : task
      );
      return updatedTasks;
    });
  }, []);

    const renderTaskList = useCallback((day) => {
    const filteredTasks = tasks.filter(task => task.day === day);
    
    return (
      <ul className='space-y-2'>
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <li
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className={`flex items-center justify-between h-14 p-3 border-2 border-gray-800 rounded-xl shadow-xl cursor-move text-white`}
          >
            <div>
              <span className="font-semibold">{task.content}</span>
            </div>
            <div className='flex items-center justify-center'>
              <span className="mr-2 p-2 bg-blue-500 rounded-lg text-sm text-white">{task.day}</span>
              <span 
                className={`mr-8 px-3 py-2 text-center text-sm rounded-lg text-white ${
                  task.priority === '1' ? 'bg-red-500' : task.priority === '2' ? 'bg-yellow-500' : task.priority === '3' ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {task.priority}
              </span>
              <button
                onClick={() => removeTask(task.id)}
                className="text-red-500 hover:text-red-700 border-2 border-red-500 rounded-xl p-1"
              >
                <X size={20} />
              </button>
            </div>
          </li>
        )) : <li className='text-center text-gray-500'>No tasks found</li>}
      </ul>
    );
  }, [tasks, removeTask]);

  return (
    <div className="max-w-[70%] relative mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Task Manager</h1>
      
      <div className="space-y-2 mb-4 max-w-2xl mx-auto">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full h-14 p-2 border rounded-xl"
          placeholder="Add a new task"
        />
        <div className="flex space-x-2 absolute right-[22rem] top-16">
          <select
            value={taskDay}
            onChange={(e) => setTaskDay(e.target.value)}
            className="flex-1 p-2 border rounded-xl"
          >
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
          </select>
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            className="flex-1 p-2 border rounded-xl"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <button
          onClick={addTask}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          <Plus size={20} className="inline mr-2" /> Add Task
        </button>
      </div>

      <div className='mt-20 border-2 border-gray-800 rounded-xl p-4 flex'>
        <div 
          className='w-1/2 border-2 border-gray-800 rounded-xl p-4 mx-4'
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, 'Today')}
        >
          <h2 className='text-xl font-bold mb-4 text-center'>Today's Tasks</h2>
          {renderTaskList('Today')}
        </div>
        <div 
          className='w-1/2 border-2 border-gray-800 rounded-xl p-4 mx-4'
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, 'Tomorrow')}
        >
          <h2 className='text-xl font-bold mb-4 text-center'>Tomorrow's Tasks</h2>
          {renderTaskList('Tomorrow')}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;