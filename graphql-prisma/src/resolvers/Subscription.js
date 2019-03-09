const Subscription = {
  comment: {
    subscribe(_parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId
              }
            }
          }
        },
        info
      );
    },

    post: {
      subscribe(_parent, _args, { prisma }, info) {
        return prisma.subscription.post(
          {
            where: {
              node: {
                published: true
              }
            }
          },
          info
        );
      }
    }
  }
};

export { Subscription as default };
