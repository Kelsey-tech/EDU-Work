const User = require('../models/user-model');

exports.createUser = (data) => User.create(data);
exports.getUsers = () => User.find();
exports.getUser = (id) => User.findById(id);