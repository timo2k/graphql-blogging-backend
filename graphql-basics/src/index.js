import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Scalar types - String, Boolean, Float, Int, ID

// Demo user data
const users = [
  {
    id: '1',
    name: 'Timo',
    email: 'test@example.com',
    age: 30
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
  },
  {
    id: '3',
    name: 'Doof',
    email: 'doof@doof.de',
    age: 1234
  }
];

const posts = [
  {
    id: '123',
    title: 'Hallo Welt',
    body: 'Hier und jetzt bin ich',
    published: true,
    author: '1'
  },
  {
    id: '1234',
    title: 'elt',
    body: 'Keine Ahnung was man hier sonst so schreiben soll',
    published: true,
    author: '1'
  },
  {
    id: '12345',
    title: 'Geh weg',
    body: 'Und hier bin ich und gehe gerade weg du dasu',
    published: true,
    author: '1'
  },
  {
    id: '5345',
    title: 'Der letzte',
    body: 'Ein letzter Artikel',
    published: false,
    author: '1'
  },
  {
    id: '56756',
    title: 'Doch nich!t!',
    body: 'Das hier ist aber der letzte Post',
    published: true,
    author: '2'
  }
];

// Resolvers
const resolvers = {
  Query: {
    posts(parent, args) {
      if (!args.query) {
        return posts;
      }

      return posts.filter(post => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me() {
      return {
        id: '12345567889',
        name: 'Mike',
        email: 'mike@example.com'
      };
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: '',
        published: false
      };
    }
  },

  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => {
        return user.email === args.email;
      });

      if (emailTaken) {
        throw new Error('Email taken.');
      }

      const user = {
        id: uuidv4(),
        ...args
      };

      users.push(user);

      return user;
    }
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(() => {
  console.log('Server is up!');
});
