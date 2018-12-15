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
};

module.exports = Mutations;
