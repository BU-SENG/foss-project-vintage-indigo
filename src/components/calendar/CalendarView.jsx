import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView({ sessions, courses }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const getSessionsForDay = (day) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.scheduledDate);
      return sessionDate.getDate() === day &&
             sessionDate.getMonth() === month &&
             sessionDate.getFullYear() === year;
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Calendar</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={prevMonth} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xl font-semibold min-w-[200px] text-center">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={nextMonth} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}
          
          {Array(startingDayOfWeek).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          
          {Array(daysInMonth).fill(null).map((_, i) => {
            const day = i + 1;
            const daySessions = getSessionsForDay(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === month && 
                           new Date().getFullYear() === year;
            
            return (
              <div
                key={day}
                className={`aspect-square border rounded-lg p-2 ${
                  isToday ? 'bg-indigo-50 border-indigo-500' : 'border-gray-200'
                }`}
              >
                <div className="text-sm font-semibold mb-1">{day}</div>
                <div className="space-y-1">
                  {daySessions.slice(0, 3).map(session => {
                    const course = courses.find(c => c.id === session.courseId);
                    return (
                      <div
                        key={session.id}
                        className={`text-xs p-1 rounded ${course?.color} text-white truncate ${
                          session.completed ? 'opacity-50' : ''
                        }`}
                        title={session.title}
                      >
                        {session.title}
                      </div>
                    );
                  })}
                  {daySessions.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{daySessions.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}