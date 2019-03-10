const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Mutation = {
  async createItem(parent, args, context, info) {
    const item = await context.db.mutation.createItem({
      data: {
        ...args
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
    
    // const item = await context.db.query.item({ where }, `(id, title)`);

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
};

module.exports = Mutation;
