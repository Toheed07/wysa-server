const User = require("../models/user");

// @desc Get all users count
// @route GET /users/size
const getUserCount = async (req, res) => {
  try {
    // Get the count of all users from MongoDB
    const count = await User.countDocuments();

    // If no users
    if (count === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json({ count });
  } catch (error) {
    console.error("Error getting user count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Get all users
// @route GET /users
const getAllUsers = async (req, res) => {
  try {
    // Get the current page from query parameters or default to 1
    const page = parseInt(req.query.page) || 1;
    const perPage = 20; // Number of users per page

    // Calculate the skip value based on the current page
    const skip = (page - 1) * perPage;

    // Get users for the current page from MongoDB
    const users = await User.find().skip(skip).limit(perPage).lean();

    // If no users
    if (!users?.length) {
      return res.status(404).json({ message: "No users found for this page" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Get user by ID
// @route GET /users/:id
const getUserById = async (req, res) => {
  const { id } = req.params;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist?
  const user = await User.findOne({ id: id }).lean().exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  res.json(user);
};

// @desc Get user by name
// @route GET /users/name/:name
const getUsersByName = async (req, res) => {
  const { name } = req.params;
  // Confirm data
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  try {
    // Search for users where either firstname or lastname contains the provided name
    const users = await User.find({
      $or: [
        { first_name: { $regex: name, $options: "i" } },
        { last_name: { $regex: name, $options: "i" } },
      ],
    })
      .lean()
      .exec();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error finding users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Get user by filter
// @route GET /users/filter
const getUsersByFilters = async (req, res) => {
  let { domain, gender, availability } = req.query;
  console.log(domain.split(","));
  console.log(gender.split(","));
  console.log(availability.split(","));

    domain = domain ? domain.split(",") : [];
    gender = gender ? gender.split(",") : [];
    availability = availability ? availability.split(",") : [];
  try {
    let query = {};

    // Check if domain filter is provided
    if (domain && domain.length > 0) {
      query.domain = { $in: domain };
    }

    // Check if gender filter is provided
    if (gender && gender.length > 0) {
      query.gender = { $in: gender };
    }

    // Check if availability filter is provided
    if (availability && availability.length > 0) {
      query.availability = { $in: availability };
    }

    // Execute the query to find users
    const users = await User.find(query).lean().exec();

    res.json(users);
  } catch (error) {
    console.error("Error finding users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Create new user
// @route POST /users
const createNewUser = async (req, res) => {
  const {
    id,
    first_name,
    last_name,
    email,
    gender,
    avatar,
    domain,
    available,
  } = req.body;

  // Confirm data
  if (
    !id ||
    !first_name ||
    !last_name ||
    !email ||
    !gender ||
    !avatar ||
    !domain ||
    available === undefined
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate id
  const duplicate = await User.findOne({ id }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate id" });
  }

  const userObject = {
    id,
    first_name,
    last_name,
    email,
    gender,
    avatar,
    domain,
    available,
  };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    //created
    res
      .status(201)
      .json({ message: `New user ${first_name} ${last_name} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc Update a user
// @route PATCH /users/:id
const updateUser = async (req, res) => {
  const {
    id,
    first_name,
    last_name,
    email,
    gender,
    avatar,
    domain,
    available,
  } = req.body;

  // Confirm data
  if (
    !id ||
    !first_name ||
    !last_name ||
    !email ||
    !gender ||
    !avatar ||
    !domain ||
    typeof available !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Does the user exist to update?
  const user = await User.findOne({ id: id }).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  user.first_name = first_name;
  user.last_name = last_name;
  user.email = email;
  user.gender = gender;
  user.avatar = avatar;
  user.domain = domain;
  user.available = available;

  const updatedUser = await user.save();

  res.json({
    message: `${updatedUser.first_name} ${updatedUser.last_name} updated`,
  });
};
// @desc Delete a user
// @route DELETE /users/:id
const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist to delete?
  const user = await User.findOne({ id: id }).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await User.deleteOne({ id: id });

  const reply = `User ${user.first_name} ${user.last_name} with ID ${id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserCount,
  createNewUser,
  updateUser,
  deleteUser,
  getUsersByName,
  getUsersByFilters,
};
