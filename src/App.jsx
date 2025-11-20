import React, { useState } from 'react';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import SessionsView from './components/sessions/SessionsView';
import CoursesView from './components/courses/CoursesView';
import CalendarView from './components/calendar/CalendarView';
import GoalsView from './components/goals/GoalsView';

export default function App() {
  const [courses, setCourses] = useState([
    { id: 1, name: 'React Development', color: 'bg-blue-500', totalHours: 0 },
    { id: 2, name: 'Data Structures', color: 'bg-green-500', totalHours: 0 },
    { id: 3, name: 'System Design', color: 'bg-purple-500', totalHours: 0 }
  ]);

  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');

  const addSession = (session) => {
    const newSession = {
      ...session,
      id: Date.now(),
      completed: false,
      date: new Date().toISOString()
    };
    setSessions([...sessions, newSession]);
  };

  const toggleSessionComplete = (sessionId) => {
    setSessions(sessions.map(session => {
      if (session.id === sessionId) {
        const updatedSession = { ...session, completed: !session.completed };
        
        if (updatedSession.completed) {
          setCourses(courses.map(course => 
            course.id === session.courseId 
              ? { ...course, totalHours: course.totalHours + session.duration }
              : course
          ));
        } else {
          setCourses(courses.map(course => 
            course.id === session.courseId 
              ? { ...course, totalHours: Math.max(0, course.totalHours - session.duration) }
              : course
          ));
        }
        
        return updatedSession;
      }
      return session;
    }));
  };

  const deleteSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.completed) {
      setCourses(courses.map(course => 
        course.id === session.courseId 
          ? { ...course, totalHours: Math.max(0, course.totalHours - session.duration) }
          : course
      ));
    }
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  const addCourse = (courseName, color) => {
    const newCourse = {
      id: Date.now(),
      name: courseName,
      color: color,
      totalHours: 0
    };
    setCourses([...courses, newCourse]);
  };

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now(),
      completed: false,
      createdDate: new Date().toISOString()
    };
    setGoals([...goals, newGoal]);
  };

  const toggleGoalComplete = (goalId) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (goalId) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView={activeView} setActiveView={setActiveView} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeView === 'dashboard' && (
          <Dashboard courses={courses} sessions={sessions} goals={goals} />
        )}
        
        {activeView === 'sessions' && (
          <SessionsView 
            courses={courses}
            sessions={sessions}
            addSession={addSession}
            toggleSessionComplete={toggleSessionComplete}
            deleteSession={deleteSession}
          />
        )}
        
        {activeView === 'calendar' && (
          <CalendarView sessions={sessions} courses={courses} />
        )}
        
        {activeView === 'goals' && (
          <GoalsView 
            courses={courses}
            goals={goals}
            addGoal={addGoal}
            toggleGoalComplete={toggleGoalComplete}
            deleteGoal={deleteGoal}
            sessions={sessions}
          />
        )}
        
        {activeView === 'courses' && (
          <CoursesView courses={courses} addCourse={addCourse} />
        )}
      </main>
    </div>
  );
}