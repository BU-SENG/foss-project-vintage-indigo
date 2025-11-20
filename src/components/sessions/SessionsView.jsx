import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddSessionForm from './AddSessionForm';
import SessionItem from './SessionItem';

export default function SessionsView({ courses, sessions, addSession, toggleSessionComplete, deleteSession }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.scheduledDate);
    const now = new Date();
    
    if (filter === 'upcoming') return sessionDate > now && !session.completed;
    if (filter === 'past') return sessionDate < now || session.completed;
    if (filter === 'completed') return session.completed;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Study Sessions</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Session</span>
        </button>
      </div>

      {showAddForm && (
        <AddSessionForm
          courses={courses}
          addSession={addSession}
          onClose={() => setShowAddForm(false)}
        />
      )}

      <div className="flex space-x-2">
        {['all', 'upcoming', 'past', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === f 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">All Sessions</h3>
          <div className="space-y-2">
            {filteredSessions.map(session => (
              <SessionItem
                key={session.id}
                session={session}
                course={courses.find(c => c.id === session.courseId)}
                toggleComplete={() => toggleSessionComplete(session.id)}
                onDelete={() => deleteSession(session.id)}
              />
            ))}
            {filteredSessions.length === 0 && (
              <p className="text-gray-500 text-center py-8">No sessions found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}