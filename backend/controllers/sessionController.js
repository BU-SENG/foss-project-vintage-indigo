const supabase = require('../config/database');

// Get all sessions for a course
exports.getCourseSessions = async (req, res) => {
  try {
    const { courseId } = req.params;

    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('course_id', courseId)
      .order('session_order', { ascending: true });

    if (error) throw error;

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Server error fetching sessions' });
  }
};

// Get single session by ID
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_id', id)
      .single();

    if (error || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Server error fetching session' });
  }
};

// Create new session
exports.createSession = async (req, res) => {
  try {
    const { course_id, title, description, content, session_order, duration } = req.body;

    if (!course_id || !title) {
      return res.status(400).json({ error: 'Course ID and title are required' });
    }

    const { data: session, error } = await supabase
      .from('sessions')
      .insert([
        {
          course_id,
          title,
          description: description || '',
          content: content || '',
          session_order: session_order || 1,
          duration: duration || 0
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Session created successfully',
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Server error creating session' });
  }
};

// Update session
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, session_order, duration } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (session_order !== undefined) updateData.session_order = session_order;
    if (duration !== undefined) updateData.duration = duration;

    const { data: session, error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('session_id', id)
      .select()
      .single();

    if (error || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      message: 'Session updated successfully',
      session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Server error updating session' });
  }
};

// Delete session
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('session_id', id);

    if (error) throw error;

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Server error deleting session' });
  }
};

// Mark session as completed
exports.completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if progress record exists
    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', id)
      .single();

    if (existing) {
      // Update existing record
      const { data: progress, error } = await supabase
        .from('user_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('session_id', id)
        .select()
        .single();

      if (error) throw error;

      return res.json({
        message: 'Session marked as completed',
        progress
      });
    } else {
      // Create new progress record
      const { data: progress, error } = await supabase
        .from('user_progress')
        .insert([
          {
            user_id: userId,
            session_id: id,
            completed: true,
            completed_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: 'Session marked as completed',
        progress
      });
    }
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ error: 'Server error marking session as completed' });
  }
};

// Get user progress for a course
exports.getUserProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const { data: progress, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        sessions (
          session_id,
          course_id,
          title
        )
      `)
      .eq('user_id', userId)
      .eq('sessions.course_id', courseId);

    if (error) throw error;

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
};