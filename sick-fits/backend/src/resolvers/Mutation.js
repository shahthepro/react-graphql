const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeAnEmail } = require('../mail');
const { hasPermission } = require('./../utils');

const Mutation = {
  async createItem(parent, args, context, info) {
    if (!context.request.userId) {
      throw new Error(`You must be logged in to do that`);
    }

    const item = await context.db.mutation.createItem({
      data: {
        ...args,
        user: {
          connect: {
            id: context.request.userId
          }
        }
      },
    }, info);

    return item;
  },
  
  async updateItem(parent, args, context, info) {
    const updates = {...args};
    delete updates.id;

    const item = await context.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      }
    }, info);

    return item;
  },

  async deleteItem(parent, args, context, info) {
    const where = { id: args.id };

    const { user, userId } = context.request;

    if (!user) {
      throw new Error(`You must be logged in!`);
    }

    const item = await context.db.query.item({ where }, `{id user { id }}`);

    if (!item.user) {
      throw new Error(`Something went wrong`);
    }

    const ownsItem = item.user.id === userId;
    const hasPermissions = user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));

    if (!ownsItem && !hasPermissions) {
      throw new Error(`You do not have permission`);
    }

    return context.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, context, info) {
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);

    const data = {
      ...args,
      email,
      password,
      permissions: { set: ['USER'] },
    };

    const user = await context.db.mutation.createUser({
      data
    }, info);

    const token = jwt.sign({
      userId: user.id,
    }, process.env.APP_SECRET);

    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return user;
  },

  async signin(parent, args, context, info) {
    const { email, password } = args;

    const user = await context.db.query.user({ where: { email }});

    if (!user) {
      throw new Error(`Invalid email address`);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error(`Invalid password`);
    }

    const token = jwt.sign({
      userId: user.id,
    }, process.env.APP_SECRET);

    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return user;
  },

  signout(parent, args, context, info) {
    context.response.clearCookie('token');
    return { message: 'Session terminated' };
  },

  async requestReset(parent, args, context, info) {
    const { email } = args;

    const user = await context.db.query.user({ where: { email }});

    if (!user) {
      throw new Error(`Invalid email address`);
    }

    const promisifiedRandomBytes = promisify(randomBytes);
    const resetToken = (await promisifiedRandomBytes(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    await context.db.mutation.updateUser({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });

    const mailRes = await transport.sendMail({
      from: 'no-reply@localhost',
      to: user.email,
      subject: 'Your password reset request',
      html: makeAnEmail(`
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset your password</a>
      `)
    })
    

    return { message: 'Reset instructions sent' };
  },

  async resetPassword(parent, args, context, info) {
    const { resetToken, newPassword, verifyPassword } = args;

    if (newPassword !== verifyPassword) {
      throw new Error(`Password mismatch`);
    }

    const user = (await context.db.query.users({ where: {
      resetToken,
      resetTokenExpiry_gte: (Date.now() - 3600000)
    }}))[0];

    if (!user) {
      throw new Error(`Invalid reset token`);
    }

    const password = await bcrypt.hash(newPassword, 10);

    const updatedUser = await context.db.mutation.updateUser({
      where: { id: user.id },
      data: { password, resetToken: null, resetTokenExpiry: null }
    });

    const token = jwt.sign({
      userId: user.id,
    }, process.env.APP_SECRET);

    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });


    return updatedUser;
  },

  async updatePermissions(parent, args, context, info) {
    if (!context.request.user) {
      throw new Error(`You must be logged in`);
    }

    const currentUser = context.request.user;

    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

    const { userId, permissions } = args;

    return context.db.mutation.updateUser({
      data: {
        permissions: {
          set: permissions
        }
      },
      where: { id: userId }
    }, info);
  },

  async addToCart(parent, args, context, info) {
    const { user } = context.request;

    if (!user) {
      throw new Error(`You must be logged in`);
    }

    const [existingCartItem] = await context.db.query.cartItems({
      where: {
        user: {
          id: user.id
        },
        item: {
          id: args.id
        }
      }
    });

    if (existingCartItem) {
      return context.db.mutation.updateCartItem({
        data: { quantity: existingCartItem.quantity + 1 },
        where: { id: existingCartItem.id },
      }, info);
    }

    return context.db.mutation.createCartItem({
      data: {
        user: { connect: { id: user.id } },
        item: { connect: { id: args.id }},
        quantity: 1
      }
    }, info);
  },

  async removeFromCart(parent, args, context, info) {
    const { user } = context.request;

    if (!user) {
      throw new Error(`You must be logged in`);
    }

    const where = { id: args.id };

    const existingCartItem = await context.db.query.cartItem({ where }, `{ id user { id } }`);

    if (!existingCartItem) {
      throw new Error(`Item does not exist in the cart`);
    }

    if (existingCartItem.user.id !== user.id) {
      throw new Error(`You are not authorized to do that.`)
    }

    return context.db.mutation.deleteCartItem({ where }, info);
  },
};

module.exports = Mutation;
