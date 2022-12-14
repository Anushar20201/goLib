const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    //adding query based om typeDefs
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("books");

        return userData;
      }

      throw new AuthenticationError('Sorry, user not logged in');
    },
  },
          //adding mutation based om typeDefs

  Mutation: {
        //when a new user is added/signed-in
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log(err);
      }
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
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.input } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }
            throw new AuthenticationError('Pls log in!')
    },
            //removing(pulling out) the book based on bookId and returning the left ones

    removeBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError("Do log in!");
    },
  },
};

module.exports = resolvers;
