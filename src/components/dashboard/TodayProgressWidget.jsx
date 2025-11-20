import React from 'react';
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react';

export default function TodayProgressWidget({ sessions, goals, courses }) {
    const today = new Date();
    const todayString = today.toDateString();

    // Get today's sessions
    const todaySessions = sessions.filter(session => {
        const sessionDate = new Date(session.scheduledDate);
        return sessionDate.toDateString() === todayString;
    });

    const todayCompletedSessions = todaySessions.filter(s => s.completed);
    const todayTotalHours = todayCompletedSessions.reduce((sum, session) => sum + session.duration, 0);
    const todayScheduledHours = todaySessions.reduce((sum, session) => sum + session.duration, 0);

    // Calculate completion percentage
    const completionPercentage = todayScheduledHours > 0
        ? (todayTotalHours / todayScheduledHours) * 100
        : 0;

    // Get active goals that are due today or overdue
    const urgentGoals = goals.filter(goal => {
        if (!goal.deadline || goal.completed) return false;
        const deadline = new Date(goal.deadline);
        return deadline <= today;
    });

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white dark:from-indigo-600 dark:to-purple-700">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Today's Progress</h2>
                <Calendar className="w-6 h-6 opacity-80" />
            </div>

            <div className="space-y-4">
                {/* Study Hours Progress */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">Study Hours</span>
                        </div>
                        <span className="text-sm font-bold">
                            {todayTotalHours.toFixed(1)} / {todayScheduledHours.toFixed(1)} hrs
                        </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                            className="bg-white rounded-full h-2 transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                        />
                    </div>
                    <p className="text-xs mt-1 opacity-90">
                        {completionPercentage.toFixed(0)}% of today's schedule complete
                    </p>
                </div>

                {/* Sessions Summary */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4"/>
                        <span className="text-sm">Sessions</span>
                    </div>
                    <span className="text-sm font-semibold">
                        {todayCompletedSessions.length} / {todaySessions.length} completed
                    </span>
                </div>

                {/* Urgent Goals Alert */}
                {urgentGoals.length > 0 && (
                    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <div className="flex items-center space-x-2 mb-1">
                            <Target className="w-4 h-4"/>
                            <span className="text-sm font-medium">Urgent Goals</span>
                        </div>
                        <p className="text-xs opacity-90">
                            {urgentGoals.length} goal{urgentGoals.length > 1 ? 's' : ''} need{urgentGoals.length === 1 ? 's' : ''} attention
                        </p>
                    </div>
                )}

                {/* Motivational Message */}
                <div className="text-center pt-2">
                    {completionPercentage === 100 ? (
                        <p className="text-sm font-medium">Great job! You've completed today's schedule!</p>
                    ) : completionPercentage >= 50 ? (
                        <p className="text-sm font-medium">You're doing great! Keep it up!</p>
                    ) : todaySessions.length === 0 ? (
                        <p className="text-sm font-medium">No sessions scheduled for today</p>
                    ) : (
                        <p className="text-sm font-medium">Let's make today productive!</p>
                    )}
                </div>
            </div>
        </div>
    );
}