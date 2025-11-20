import React from 'react';

export default function CourseProgressBar({ course, sessionsCount }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${course.color}`}></div>
          <span className="font-medium text-gray-900">{course.name}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-gray-900">{course.totalHours.toFixed(1)}h</span>
          <span className="text-xs text-gray-500 ml-2">({sessionsCount} sessions)</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${course.color}`}
          style={{ width: `${Math.min((course.totalHours / 50) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}