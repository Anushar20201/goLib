const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    //adding query based om typeDefs
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return userData;
      }

      throw new AuthenticationError('Sorry, user not logged in');
    },
  },
          //adding mutation based om typeDefs

  Mutation: {
        //when a new user is added/signed-in
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
        //when user logins with valid creds and displayimg same error for invalid creds
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
                throw new AuthenticationError('Invalid credentials')
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Invalid credentials')
      }
            //returning JWT based on users' credentials
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: input } },
          { new: true }
        );

        return updatedUser;
      }
            throw new AuthenticationError('Pls log in!')
    },
        //removing(pulling out) the book based on bookId and returning the left ones
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );

        return updatedUser;
      }

    },
  },
};

module.exports = resolvers;
