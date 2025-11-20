import React from 'react';
import { Clock, Check, BookOpen, Target } from 'lucide-react';
import StatCard from './StatCard';
import CourseProgressBar from './CourseProgressBar';
import TodayProgressWidget from './TodayProgressWidget';
import ProgressChart from './ProgressChart';

export default function Dashboard({ courses, sessions, goals }) {
    const completedSessions = sessions.filter(s => s.completed);
    const totalHours = courses.reduce((sum, course) => sum + course.totalHours, 0);
    const totalSessions = completedSessions.length;
    const activeGoalsCount = goals.filter(g => !g.completed).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
            </div>

            {/* Today's Progress Widget */}
            <TodayProgressWidget sessions={sessions} goals={goals} courses={courses} />

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

            {/* Progress Chart */}
            <ProgressChart sessions={sessions} courses={courses} />

            {/* Course Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Study Hours by Course</h3>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
                <div className="space-y-3">
                    {completedSessions.slice(-5).reverse().map(session => {
                        const course = courses.find(c => c.id === session.courseId);
                        return (
                            <div key={session.id} className="flex items-center justify-between py-2 border-b dark:border-gray-600 last:border-b-0">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${course?.color}`}></div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{session.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{course?.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{session.duration}h</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(session.scheduledDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {completedSessions.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No completed sessions yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}