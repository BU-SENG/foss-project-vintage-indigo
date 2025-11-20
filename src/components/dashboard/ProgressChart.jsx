import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export default function ProgressChart({ sessions, courses }) {
    // Get last 7 days of data
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({
                date: date,
                dateString: date.toDateString(),
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: date.getDate()
            });
        }
        return days;
    };

    const last7Days = getLast7Days();

    // Calculate daily study hours
    const dailyData = last7Days.map(day => {
        const daySessions = sessions.filter(session => {
            const sessionDate = new Date(session.scheduledDate);
            return sessionDate.toDateString() === day.dateString && session.completed;
        });

        const totalHours = daySessions.reduce((sum, session) => sum + session.duration, 0);
        const sessionCount = daySessions.length;

        return {
            ...day,
            hours: totalHours,
            sessions: sessionCount
        };
    });

    // Find max hours for scaling
    const maxHours = Math.max(...dailyData.map(d => d.hours), 1);
    const totalWeekHours = dailyData.reduce((sum, day) => sum + day.hours, 0);
    const averageDaily = totalWeekHours / 7;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"/>
                        Weekly Progress
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Last 7 days study activity</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalWeekHours.toFixed(1)}h</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total this week</div>
                </div>
            </div>

            <div className="relative">
                <div className="flex items-end justify-between h-40 mb-4">
                    {dailyData.map((day, index) => {
                        const heightPercentage = maxHours > 0 ? (day.hours / maxHours) * 100 : 0;
                        const isToday = day.dateString === new Date().toDateString();
                        return (
                            <div key={index} className="flex flex-col items-center flex-1 mx-1">
                                <div className="relative w-full max-w-[40px] flex flex-col justify-end h-32">
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-500 ease-out ${
                                            isToday
                                                ? 'bg-gradient-to-t from-indigo-500 to-purple-500'
                                                : day.hours > 0
                                                ? 'bg-gradient-to-t from-indigo-400 to-indigo-300'
                                                : 'bg-gray-200 dark:bg-gray-600'
                                        }`}
                                        style={{
                                            height: `${Math.max(heightPercentage, 2)}%`,
                                            minHeight: day.hours > 0 ? '8px' : '4px'
                                        }}
                                    />
                                    {day.hours > 0 && (
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                {day.hours.toFixed(1)}h
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-2 text-center">
                                    <div className={`text-sm font-medium ${
                                        isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                        {day.dayName}
                                    </div>
                                    <div className={`text-xs ${
                                        isToday ? 'text-indigo-500 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {day.dayNumber}
                                    </div>
                                    {day.sessions > 0 && (
                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {day.sessions} session{day.sessions > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="absolute bottom-16 left-0 right-0 h-px bg-gray-200 dark:bg-gray-600"></div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {averageDaily.toFixed(1)}h
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Daily Average</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {dailyData.reduce((sum, day) => sum + day.sessions, 0)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {dailyData.filter(day => day.hours > 0).length}/7
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Active Days</div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
                {totalWeekHours > 0 ? (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>Keep up the great work!</span>
                    </div>
                ) : (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Start tracking your study progress</span>
                    </div>
                )}
            </div>
        </div>
    );
}