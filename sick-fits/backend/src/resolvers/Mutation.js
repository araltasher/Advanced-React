const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  createItem(parent, args, ctx, info) {
    //  TODO check if they are logged in
    const item = ctx.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info
    );

    return item;
  },

  updateItem(parent, args, ctx, info) {
    //  Take a copy of the updates
    const updates = { ...args };
    //  Remove the ID from the updates
    delete updates.id;
    //  Run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    //  Find the item
    const item = await ctx.db.query.item(
      { where },
      `{ id
    title}`
    );
    //  Check if item exists and user has permissions
    //  Delete item
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    //  lowercase the email
    args.email = args.email.toLowerCase();

    //  HASH THE PASSWORD //
    const password = await bcrypt.hash(args.password, 10);

    //  create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: {
            set: ['USER'],
          },
        },
      },
      info
    );
    //  create theJWT token for users
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //  set jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year Cookie
    });

    return user;
  },
};

module.exports = Mutations;
