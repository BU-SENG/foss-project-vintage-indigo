import React, { useState } from 'react';
import { Plus, Check, Trash2, BookOpen } from 'lucide-react';

export default function GoalsView({ courses, goals, addGoal, toggleGoalComplete, deleteGoal }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [targetHours, setTargetHours] = useState(10);
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [deadline, setDeadline] = useState('');

  const handleAddGoal = () => {
    if (goalTitle && targetHours > 0) {
      addGoal({
        title: goalTitle,
        targetHours: parseFloat(targetHours),
        courseId: courseId ? parseInt(courseId) : null,
        deadline: deadline || null
      });
      setGoalTitle('');
      setTargetHours(10);
      setCourseId(courses[0]?.id || '');
      setDeadline('');
      setShowAddForm(false);
    }
  };

  const calculateProgress = (goal) => {
    if (goal.courseId) {
      const course = courses.find(c => c.id === goal.courseId);
      return course ? (course.totalHours / goal.targetHours) * 100 : 0;
    } else {
      const totalHours = courses.reduce((sum, c) => sum + c.totalHours, 0);
      return (totalHours / goal.targetHours) * 100;
    }
  };

  const getCurrentHours = (goal) => {
    if (goal.courseId) {
      const course = courses.find(c => c.id === goal.courseId);
      return course ? course.totalHours : 0;
    } else {
      return courses.reduce((sum, c) => sum + c.totalHours, 0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Study Goals</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">New Goal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Title
              </label>
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Master React Fundamentals"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Hours
                </label>
                <input
                  type="number"
                  value={targetHours}
                  onChange={(e) => setTargetHours(e.target.value)}
                  min="1"
                  step="0.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course (Optional)
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={handleAddGoal} 
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Goal
              </button>
              <button 
                onClick={() => setShowAddForm(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = calculateProgress(goal);
          const currentHours = getCurrentHours(goal);
          const course = goal.courseId ? courses.find(c => c.id === goal.courseId) : null;
          const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !goal.completed;
          
          return (
            <div 
              key={goal.id} 
              className={`bg-white rounded-lg shadow p-6 ${goal.completed ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${
                    goal.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {goal.title}
                  </h3>
                  {course && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${course.color}`}></div>
                      <span className="text-sm text-gray-600">{course.name}</span>
                    </div>
                  )}
                  {!course && (
                    <div className="flex items-center space-x-2 mt-1">
                      <BookOpen className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">All Courses</span>
                    </div>
                  )}
                  {goal.deadline && (
                    <p className={`text-sm mt-1 ${
                      isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'
                    }`}>
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                      {isOverdue && ' (Overdue)'}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleGoalComplete(goal.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      goal.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteGoal(goal.id)} 
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">
                    {currentHours.toFixed(1)} / {goal.targetHours}h
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      progress >= 100 ? 'bg-green-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-right">
                  {Math.min(progress, 100).toFixed(0)}% Complete
                </p>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            No goals yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  );
}