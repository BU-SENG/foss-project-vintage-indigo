const supabase = require('../config/database');

// Get all goals for a user
exports.getUserGoals = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Server error fetching goals' });
  }
};

// Get single goal by ID
exports.getGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const { data: goal, error } = await supabase
      .from('goals')
      .select('*')
      .eq('goal_id', id)
      .eq('user_id', userId)
      .single();

    if (error || !goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ goal });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ error: 'Server error fetching goal' });
  }
};

// Create new goal
exports.createGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, target_date, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data: goal, error } = await supabase
      .from('goals')
      .insert([
        {
          user_id: userId,
          title,
          description: description || '',
          target_date: target_date || null,
          category: category || 'General',
          completed: false
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Goal created successfully',
      goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Server error creating goal' });
  }
};

// Update goal
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { title, description, target_date, category, completed } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (target_date !== undefined) updateData.target_date = target_date;
    if (category) updateData.category = category;
    if (completed !== undefined) {
      updateData.completed = completed;
      if (completed) {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }
    }

    const { data: goal, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('goal_id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({
      message: 'Goal updated successfully',
      goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Server error updating goal' });
  }
};

// Delete goal
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('goal_id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Server error deleting goal' });
  }
};

// Toggle goal completion
exports.toggleGoalCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Get current goal state
    const { data: currentGoal, error: fetchError } = await supabase
      .from('goals')
      .select('completed')
      .eq('goal_id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !currentGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Toggle completion
    const newCompleted = !currentGoal.completed;
    const updateData = {
      completed: newCompleted,
      completed_at: newCompleted ? new Date().toISOString() : null
    };

    const { data: goal, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('goal_id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: `Goal ${newCompleted ? 'completed' : 'reopened'} successfully`,
      goal
    });
  } catch (error) {
    console.error('Toggle goal error:', error);
    res.status(500).json({ error: 'Server error toggling goal completion' });
  }
};