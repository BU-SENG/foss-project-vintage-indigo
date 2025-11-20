import React from 'react';
import { Check, Trash2 } from 'lucide-react';

export default function SessionItem({ session, course, toggleComplete, onDelete }) {
  const isUpcoming = new Date(session.scheduledDate) > new Date() && !session.completed;
  const isPast = new Date(session.scheduledDate) < new Date() && !session.completed;
  
  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
      session.completed ? 'bg-green-50 border-green-200' : 
      isUpcoming ? 'bg-blue-50 border-blue-200' :
      isPast ? 'bg-yellow-50 border-yellow-200' :
      'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 flex-1">
        <button
          onClick={toggleComplete}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            session.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {session.completed && <Check className="w-4 h-4 text-white" />}
        </button>
        
        <div className={`w-3 h-3 rounded-full ${course?.color}`}></div>
        
        <div className="flex-1">
          <p className={`font-medium ${session.completed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
            {session.title}
          </p>
          <p className="text-sm text-gray-500">{course?.name}</p>
        </div>
        
        {isUpcoming && (
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Upcoming</span>
        )}
        {isPast && (
          <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Overdue</span>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{session.duration}h</p>
          <p className="text-xs text-gray-500">
            {new Date(session.scheduledDate).toLocaleDateString()}{' '}
            {new Date(session.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}