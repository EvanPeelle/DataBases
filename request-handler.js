var url = require('url');

var router;
var db;
var handler = {};

module.exports = function(_db) {
  db = _db;
  router = require('./router.js')(db);
  return handler;
};
console.log('exports');
console.log(exports);
console.log('module.exports');
console.log(module);

handler.handleRequest = function(request, response) {
//  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var path = url.parse(request.url).pathname;
  router.trailblazer(path,request.method,request,response);
};
