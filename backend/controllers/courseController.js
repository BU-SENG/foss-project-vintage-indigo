const supabase = require('../config/database');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error fetching courses' });
  }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('course_id', id)
      .single();

    if (error || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Server error fetching course' });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, difficulty, duration } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const { data: course, error } = await supabase
      .from('courses')
      .insert([
        {
          title,
          description,
          category: category || 'General',
          difficulty: difficulty || 'Beginner',
          duration: duration || 0
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Server error creating course' });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty, duration } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (difficulty) updateData.difficulty = difficulty;
    if (duration !== undefined) updateData.duration = duration;

    const { data: course, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('course_id', id)
      .select()
      .single();

    if (error || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Server error updating course' });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('course_id', id);

    if (error) throw error;

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Server error deleting course' });
  }
};

// Enroll user in course
exports.enrollCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', id)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Already enrolled in this course' });
    }

    // Enroll user
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert([
        {
          user_id: userId,
          course_id: id
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Server error enrolling in course' });
  }
};

// Get user's enrolled courses
exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    const courses = enrollments.map(e => ({
      ...e.courses,
      enrollmentDate: e.enrolled_at,
      progress: e.progress,
      completed: e.completed
    }));

    res.json({ courses });
  } catch (error) {
    console.error('Get user courses error:', error);
    res.status(500).json({ error: 'Server error fetching enrolled courses' });
  }
};