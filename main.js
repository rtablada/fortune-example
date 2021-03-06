import dotenv from 'dotenv';
import http from 'http';
import fortuneHTTP from 'fortune-http';
import fortune from 'fortune';
import pgAdapter from 'fortune-postgres';
import jsonApiSerializer from 'fortune-json-api';

dotenv.config();

const adapter = [pgAdapter, {
  url: process.env.DATABASE_URL
}];

const recordTypes = {
  post: {
    text: String,
    createdAt: Date,
    replies: [ Array('post'), 'parent' ],
    parent: [ 'post', 'replies' ],
    author: [ 'user', 'posts' ]
  },
  user: {
    name: String,
    password: Buffer,
    salt: Buffer,
    posts: [ Array('post'), 'author' ],
    following: [ Array('user'), 'followers' ],
    followers: [ Array('user'), 'following' ]
  }
};

const store = fortune(recordTypes);

const listener = fortuneHTTP(store, {
  // The order specifies priority of media type negotiation.
  serializers: [
    jsonApiSerializer,
    fortuneHTTP.JsonSerializer,
    fortuneHTTP.HtmlSerializer,
  ]
});

const server = http.createServer((request, response) =>
  listener(request, response)
  .catch(error => {
    debugger;
  }));

server.listen(process.env.PORT || 3000);
