const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get user_id from localStorage
// Helper function to get user_id from localStorage
const getUserId = () => {
  try {
    const storedUser = localStorage.getItem('user');
    
    // Safety Check: If storage is empty or literally says "undefined", stop.
    if (!storedUser || storedUser === 'undefined') {
      return null;
    }

    const user = JSON.parse(storedUser);
    return user?.user_id || user?.id || user?._id;
  } catch (error) {
    // If parsing fails, clear the bad data and return null
    console.error("Corrupt user data found, clearing...", error);
    localStorage.removeItem('user');
    return null;
  }
};


// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const userId = getUserId();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add user-id header for authenticated requests
  if (userId && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    headers['user-id'] = userId;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    // ============================================================
    // FIX 2: THE CRITICAL CHANGE
    // This manually adds "success: true" if the backend forgot it.
    // This stops the red error box from appearing on success.
    // ============================================================
    if (data.success === undefined) {
        return { ...data, success: true };
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (username, email, password) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile: async () => {
    return apiCall('/auth/profile', {
      method: 'GET',
    });
  },
};

// Courses API
export const coursesAPI = {
  getAll: async () => {
    return apiCall('/courses', { method: 'GET' });
  },

  getById: async (id) => {
    return apiCall(`/courses/${id}`, { method: 'GET' });
  },

  create: async (name, color) => {
    return apiCall('/courses', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
  },

  update: async (id, data) => {
    return apiCall(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiCall(`/courses/${id}`, { method: 'DELETE' });
  },
};

// Sessions API
export const sessionsAPI = {
  getAll: async () => {
    return apiCall('/sessions', { method: 'GET' });
  },

  getById: async (id) => {
    return apiCall(`/sessions/${id}`, { method: 'GET' });
  },

  getByCourse: async (courseId) => {
    return apiCall(`/sessions/course/${courseId}`, { method: 'GET' });
  },

  create: async (sessionData) => {
    return apiCall('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  update: async (id, data) => {
    return apiCall(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiCall(`/sessions/${id}`, { method: 'DELETE' });
  },
};

// Goals API
export const goalsAPI = {
  getAll: async () => {
    return apiCall('/goals', { method: 'GET' });
  },

  getById: async (id) => {
    return apiCall(`/goals/${id}`, { method: 'GET' });
  },

  getByCourse: async (courseId) => {
    return apiCall(`/goals/course/${courseId}`, { method: 'GET' });
  },

  create: async (goalData) => {
    return apiCall('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  },

  update: async (id, data) => {
    return apiCall(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiCall(`/goals/${id}`, { method: 'DELETE' });
  },
};