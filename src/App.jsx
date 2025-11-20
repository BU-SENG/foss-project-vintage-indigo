import React, { useState } from 'react';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import SessionsView from './components/sessions/SessionsView';
import CoursesView from './components/courses/CoursesView';
import CalendarView from './components/calendar/CalendarView';
import GoalsView from './components/goals/GoalsView';

// Simple notification component
function Notification({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg z-50" role="alert">
      {message}
      <button className="ml-4 text-sm text-green-600 underline" onClick={onClose} aria-label="Close notification">Close</button>
    </div>
  );
}

export default function App() {
  const [courses, setCourses] = useState([
    { id: 1, name: 'React Development', color: 'bg-blue-500', totalHours: 0 },
    { id: 2, name: 'Data Structures', color: 'bg-green-500', totalHours: 0 },
    { id: 3, name: 'System Design', color: 'bg-purple-500', totalHours: 0 }
  ]);

  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState("");

  const addSession = (session) => {
    const newSession = {
      ...session,
      id: Date.now(),
      completed: false,
      date: new Date().toISOString()
    };
    setSessions([...sessions, newSession]);
    setNotification("Session added successfully!");
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
          setNotification("Session marked as completed!");
        } else {
          setCourses(courses.map(course => 
            course.id === session.courseId 
              ? { ...course, totalHours: Math.max(0, course.totalHours - session.duration) }
              : course
          ));
          setNotification("Session marked as incomplete.");
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
    setNotification("Session deleted.");
  };

  const addCourse = (courseName, color) => {
    const newCourse = {
      id: Date.now(),
      name: courseName,
      color: color,
      totalHours: 0
    };
    setCourses([...courses, newCourse]);
    setNotification("Course added successfully!");
  };

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now(),
      completed: false,
      createdDate: new Date().toISOString()
    };
    setGoals([...goals, newGoal]);
    setNotification("Goal added successfully!");
  };

  const toggleGoalComplete = (goalId) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
    setNotification("Goal completion status changed.");
  };

  const deleteGoal = (goalId) => {
    setGoals(goals.filter(g => g.id !== goalId));
    setNotification("Goal deleted.");
  };

  // Summary card for dashboard
  const totalHours = courses.reduce((sum, c) => sum + c.totalHours, 0);
  const completedGoals = goals.filter(g => g.completed).length;

  return (
    <div className={darkMode ? "min-h-screen bg-gray-900 text-white" : "min-h-screen bg-gray-50"}>
      <Header activeView={activeView} setActiveView={setActiveView} />
      <div className="flex justify-end p-4">
        <button
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <Notification message={notification} onClose={() => setNotification("")} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeView === 'dashboard' && (
          <>
            <div className="mb-8 flex gap-4">
              <div className="bg-white dark:bg-gray-800 rounded shadow p-6 flex-1" aria-label="Total Study Hours">
                <h2 className="text-lg font-bold mb-2">Total Study Hours</h2>
                <p className="text-2xl">{totalHours}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded shadow p-6 flex-1" aria-label="Completed Goals">
                <h2 className="text-lg font-bold mb-2">Completed Goals</h2>
                <p className="text-2xl">{completedGoals}</p>
              </div>
            </div>
            <Dashboard courses={courses} sessions={sessions} goals={goals} />
          </>
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