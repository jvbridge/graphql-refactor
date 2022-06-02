const { signToken } = require("../utils/auth");
const { User } = require("../models");
const resolvers = {
  Query: {
    user: async () => {
      return User.find().populate("savedBooks");
    },
  },
};

module.exports = resolvers;
