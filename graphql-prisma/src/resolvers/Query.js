import getUserId from '../utils/getUserId';

const Query = {
  users(_parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
        ]
      };
    }

    return prisma.query.users(opArgs, info);
  },

  myPosts(_parent, args, { prisma }, info) {
    const userId = getUserId(request);
    const opArgs = {
      where: {
        author: {
          id: userId
        }
      }
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }

    return prisma.query.posts(opArgs, info);
  },

  posts(_parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        published: true
      }
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }

    return prisma.query.posts(opArgs, info);
  },

  comments(_parent, _args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },

  async me(_parent, _args, { prisma, request }, _info) {
    const userId = getUserId(request, false);

    return await prisma.query.user({
      where: {
        id: userId
      }
    });
  },

  async post(_parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    );

    if (posts.length === 0) {
      throw new Error('Posts not found');
    }

    return posts[0];
  }
};

export { Query as default };
