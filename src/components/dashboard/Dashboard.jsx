import React from 'react';
import { Clock, Check, BookOpen, Target } from 'lucide-react';
import StatCard from './StatCard';
import CourseProgressBar from './CourseProgressBar';
import TodayProgressWidget from './TodayProgressWidget'; // Add this import

export default function Dashboard({ courses, sessions, goals }) {
  const completedSessions = sessions.filter(s => s.completed);
  const totalHours = courses.reduce((sum, course) => sum + course.totalHours, 0);
  const totalSessions = completedSessions.length;
  const activeGoalsCount = goals.filter(g => !g.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
      </div>

      {/* Today's Progress Widget - Add this section */}
      <TodayProgressWidget 
        sessions={sessions} 
        goals={goals} 
        courses={courses} 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Study Hours"
          value={totalHours.toFixed(1)}
          icon={Clock}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed Sessions"
          value={totalSessions}
          icon={Check}
          color="bg-green-500"
        />
        <StatCard
          title="Active Courses"
          value={courses.length}
          icon={BookOpen}
          color="bg-purple-500"
        />
        <StatCard
          title="Active Goals"
          value={activeGoalsCount}
          icon={Target}
          color="bg-orange-500"
        />
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Study Hours by Course</h3>
        <div className="space-y-4">
          {courses.map(course => {
            const courseCompletedSessions = completedSessions.filter(
              s => s.courseId === course.id
            );
            return (
              <CourseProgressBar
                key={course.id}
                course={course}
                sessionsCount={courseCompletedSessions.length}
              />
            );
          })}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {completedSessions.slice(-5).reverse().map(session => {
            const course = courses.find(c => c.id === session.courseId);
            return (
              <div key={session.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${course?.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{session.title}</p>
                    <p className="text-sm text-gray-500">{course?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.duration}h</p>
                  <p className="text-xs text-gray-500">
                    {new Date(session.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
          {completedSessions.length === 0 && (
            <p className="text-gray-500 text-center py-4">No completed sessions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}