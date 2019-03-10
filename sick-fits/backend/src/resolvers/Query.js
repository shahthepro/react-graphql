const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  async me(parent, args, context, info) {
    if (!context.request.userId) {
      return null;
    }

    const user = await context.db.query.user({ where: { id: context.request.userId }}, info);

    return user;
  },
  // async items(parent, args, context, info) {
  //   const items = await context.db.query.items();
  //   return items;
  // }
};

module.exports = Query;
