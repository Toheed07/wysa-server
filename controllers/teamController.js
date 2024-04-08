const User = require('../models/user')
const Team = require('../models/team')

// @desc Get all teams
// @route GET /teams
const getAllTeams = async (req, res) => {
    // Get all users from MongoDB
    const teams = await Team.find().lean()
    // If no users 
    if (!teams?.length) {
        return res.status(400).json({ message: 'No teams found' })
    }

    res.json(teams)
}

// @desc Create new teams
// @route POST /teams
const createNewTeam = async (req, res) => {
    try {
        let { name, userIds } = req.body;

        // Check if team name is provided
        if (!name) {
            return res.status(400).json({ message: 'Team name is required' });
        }

        // Check if userIds are provided
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'At least one user is required to create a team' });
        }

        // Check if provided user IDs exist
        const users = await User.find({ _id: { $in: userIds } });
        if (!users || users.length !== userIds.length) {
            return res.status(400).json({ message: 'One or more provided user IDs are invalid' });
        }

        // Create the new team
        const newTeam = await Team.create({ name, users: userIds });

        res.status(201).json(newTeam);
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc Update a teams
// @route PATCH /teams/:id
const getTeamById = async (req, res) => {
    try {
        const { teamId } = req.params;

        // Check if teamId is provided
        if (!teamId) {
            return res.status(400).json({ message: 'Team ID is required' });
        }

        // Check if team with provided ID exists
        const team = await Team.findById(teamId).populate('users').lean();
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.json(team);
    } catch (error) {
        console.error('Error fetching team by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc Delete a teams
// @route DELETE /teams/:id
const deleteTeamById = async (req, res) => {
    try {
        const { teamId } = req.params;

        // Check if teamId is provided
        if (!teamId) {
            return res.status(400).json({ message: 'Team ID is required' });
        }

        // Check if team with provided ID exists
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Delete the team
        await team.remove();

        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        console.error('Error deleting team by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllTeams,
    createNewTeam,
    getTeamById,
    deleteTeamById,
}

