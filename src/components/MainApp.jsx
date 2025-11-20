import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { coursesAPI, sessionsAPI, goalsAPI } from '../services/api';
import Header from './layout/Header';
import Dashboard from './dashboard/Dashboard';
import SessionsView from './sessions/SessionsView';
import CoursesView from './courses/CoursesView';
import CalendarView from './calendar/CalendarView';
import GoalsView from './goals/GoalsView';

export default function MainApp() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // Fetch data from backend on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [coursesRes, sessionsRes, goalsRes] = await Promise.all([
        coursesAPI.getAll(),
        sessionsAPI.getAll(),
        goalsAPI.getAll()
      ]);

      if (coursesRes.success) setCourses(coursesRes.data);
      if (sessionsRes.success) setSessions(sessionsRes.data);
      if (goalsRes.success) setGoals(goalsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNotification('Error loading data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (session) => {
    try {
      const sessionData = {
        course_id: session.courseId,
        title: session.title,
        duration: session.duration,
        scheduled_date: session.scheduledDate
      };

      const response = await sessionsAPI.create(sessionData);
      
      if (response.success) {
        setSessions([...sessions, response.data]);
        setNotification('Session added successfully!');
      }
    } catch (error) {
      console.error('Error adding session:', error);
      setNotification('Error adding session. Please try again.');
    }
  };

  const toggleSessionComplete = async (sessionId) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      const newCompletedStatus = !session.completed;

      const response = await sessionsAPI.update(sessionId, {
        completed: newCompletedStatus
      });

      if (response.success) {
        setSessions(sessions.map(s => 
          s.id === sessionId ? response.data : s
        ));

        // Refresh courses to update total hours
        const coursesRes = await coursesAPI.getAll();
        if (coursesRes.success) setCourses(coursesRes.data);

        setNotification(newCompletedStatus ? 'Session marked as completed!' : 'Session marked as incomplete.');
      }
    } catch (error) {
      console.error('Error updating session:', error);
      setNotification('Error updating session. Please try again.');
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      const response = await sessionsAPI.delete(sessionId);
      
      if (response.success) {
        setSessions(sessions.filter(s => s.id !== sessionId));
        
        // Refresh courses to update total hours
        const coursesRes = await coursesAPI.getAll();
        if (coursesRes.success) setCourses(coursesRes.data);
        
        setNotification('Session deleted.');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      setNotification('Error deleting session. Please try again.');
    }
  };

  const addCourse = async (courseName, color) => {
    try {
      const response = await coursesAPI.create(courseName, color);
      
      if (response.success) {
        setCourses([...courses, response.data]);
        setNotification('Course added successfully!');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      setNotification('Error adding course. Please try again.');
    }
  };

  const addGoal = async (goal) => {
    try {
      const goalData = {
        course_id: goal.courseId || null,
        title: goal.title,
        target_hours: goal.targetHours,
        deadline: goal.deadline || null
      };

      const response = await goalsAPI.create(goalData);
      
      if (response.success) {
        setGoals([...goals, response.data]);
        setNotification('Goal added successfully!');
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      setNotification('Error adding goal. Please try again.');
    }
  };

  const toggleGoalComplete = async (goalId) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      const newCompletedStatus = !goal.completed;

      const response = await goalsAPI.update(goalId, {
        completed: newCompletedStatus
      });

      if (response.success) {
        setGoals(goals.map(g => 
          g.id === goalId ? response.data : g
        ));
        setNotification('Goal completion status changed.');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      setNotification('Error updating goal. Please try again.');
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const response = await goalsAPI.delete(goalId);
      
      if (response.success) {
        setGoals(goals.filter(g => g.id !== goalId));
        setNotification('Goal deleted.');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      setNotification('Error deleting goal. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView={activeView} setActiveView={setActiveView} user={user} />
      
      {notification && (
        <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg z-50">
          {notification}
          <button 
            className="ml-4 text-sm text-green-600 underline" 
            onClick={() => setNotification('')}
          >
            Close
          </button>
        </div>
      )}
      
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