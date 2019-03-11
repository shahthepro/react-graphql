const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('./../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  async me(parent, args, context, info) {
    if (!context.request.userId) {
      return null;
    }

    // const user = await context.db.query.user({ where: { id: context.request.userId }}, info);

    return context.request.user;
  },
  async users(parent, args, context, info) {
    if (!context.request.userId) {
      throw new Error('You need to be logged in');
    }

    // const user = await context.db.query.user({ where: { id: context.request.userId }}, info);

    hasPermission(context.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    return context.db.query.users({}, info);
  },
  // async items(parent, args, context, info) {
  //   const items = await context.db.query.items();
  //   return items;
  // }
};

module.exports = Query;
