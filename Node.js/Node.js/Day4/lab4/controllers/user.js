const {User} = require('../models');

async function createUser(req, res) {
  try {
    const {username, password, firstName, lastName, dob} = req.body; // extract from body

    const newUser = new User({ // instance for new user to be created and store in it the extracted data from body
      username,
      password,
      firstName,
      lastName,
      dob
    });

    await newUser.save(); // save instance in db or may error throwed (mongoose validation)

    res.status(201).json(newUser); // if user created ret. him
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find({}, 'firstName'); // wait until db finish the searching (no filter , just get the users firstname)
    res.status(200).json(users); // ret. users
  } catch (error) {
    res.status(500).json({error: error.message}); // server error
  }
}

async function deleteUser(req, res) {
  try {
    const {id} = req.params;

    const deletedUser = await User.findByIdAndDelete(id); // wait until db...

    if (!deletedUser) { // if null
      return res.status(404).json({error: 'User not found'});
    }

    res.status(204).send(); // no content and success
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

async function updateUser(req, res) {
  try {
    const {id} = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id, // find by id
      req.body, // the new data
      {new: true, runValidators: true} // how (new => updated version, validtors => don't ignore schema rules)
    );

    if (!updatedUser) { // if null
      return res.status(404).json({error: 'User not found'});
    }

    res.status(200).json({ // succuess
      message: 'User was edited successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

module.exports = {
  createUser,
  getUsers,
  deleteUser,
  updateUser
};
