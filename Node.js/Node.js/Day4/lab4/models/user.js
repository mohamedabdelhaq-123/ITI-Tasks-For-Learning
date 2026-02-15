const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { // use built in validation
      type: String,
      required: true,
      unique: true,
      minlength: 8
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15
    },
    dob: {
      type: Date
    }
  },
  {
    timestamps: true // createdAt and updatedAt auto placed
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
