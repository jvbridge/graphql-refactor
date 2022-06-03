const { signToken } = require("../utils/auth");
const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const resolvers = {
  Query: {
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("savedBooks");
    },
    users: async () => {
      return User.find().populate("savedBooks");
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      const isCorrectPassword = await user.isCorrectPassword(password);

      if (!isCorrectPassword) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: { ...book },
            },
          }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  removeBook: async (parent, { bookId }, context) => {
    if (!context.user) {
      throw new AuthenticationError("You need to be logged in!");
    }
    return User.findOneAndUpdate(
      { _id: context.user._id },
      {
        $pull: {
          savedBooks: {
            _id: bookId,
          },
        },
      }
    );
  },
};

module.exports = resolvers;
