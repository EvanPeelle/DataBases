var fs = require("fs");
var db;

module.exports = function(_db){
  db = _db;
  return handler;
};

console.log('DB in my file:', db);

var handler = {};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
var headers = defaultCorsHeaders;


var routes = {
  "GET" : [
  {
    pattern: /^\/classes\/([a-z0-9]+)$/i,
    method: function(request, response, target){
      headers['Content-Type'] = "application/json";
      response.writeHead(200, headers);
        var query = "select * from messages";
        db.query(query,function(error,results){
          if (error) throw error;
          console.log(results);
          results = JSON.stringify(results);
          //console.log(results);
          response.end(results);
        });
    }
  },
  {
    pattern: /\/$/,
    method: function(request,response){
      fs.readFile('chatClient/index.html', 'utf8', function(err,data){
      headers['Content-Type'] = "text/html";
      response.writeHead(200,headers);
        response.end(data);
      });
    }
  },
  {
    pattern:/([^+]*)\.([^+]*)/,
    method: function(request,response, path, filetype){
      fs.readFile('chatClient/' + path + '.' + filetype, 'utf8', function(err,data){
      headers['Content-Type'] = "text/" + filetype;
      response.writeHead(200,headers);
        response.end(data);
      });
    }
  },
  {
    pattern: /[^+]*/,
    method: function(request, response, target){
      headers['Content-Type'] = "application/json";
      response.writeHead(404, headers);
      response.end(JSON.stringify('\n'));
    }
  }
  ],
  "POST" : [
   {
     pattern: /^\/classes\/([a-z0-9]+)$/i,
     method: function(request, response, target){
      headers['Content-Type'] = "application/json";
      request.setEncoding('utf8');
      var body = "";
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(data){
        console.log(body);
        body = JSON.parse(body);
        console.log(body.username, " ",body.text);
        response.writeHead(201, headers);
        var query = "insert into messages (username, message, room) values (?, ?, ?)";
        var queryArgs = [body.username, body.text, target];
        db.query(query,queryArgs,function(error,results){
          if (error) throw error;
          console.log("1 row inserted into table messages");
          response.end(JSON.stringify(""));
        });
      });
     }
   },
   {
    pattern: /[^+]*/,
    method: function(request, response){
      headers['Content-Type'] = "application/json";
      response.writeHead(404, headers);
      response.end(JSON.stringify('\n'));
    }
  }
  ],
  "OPTIONS" : [
  {
    pattern:/[^+]*/,
    method: function(request, response){
      headers['Content-Type'] = "application/json";
      response.writeHead(200, headers);
      response.end(JSON.stringify('\n'));
    }
  }
  ],
  "DELETE": [
  {
    pattern:/[^+]*/,
    method: function(request, response){
      headers['Content-Type'] = "application/json";
      response.writeHead(501, headers);
      response.end(JSON.stringify('\n'));
    }
  }
  ],
  "PUT": [
  {
    pattern:/[^+]*/,
    method: function(request, response){
      headers['Content-Type'] = "application/json";
      response.writeHead(501, headers);
      response.end(JSON.stringify('\n'));
    }
  }
  ]
};

handler.trailblazer = function(pathname,method,request,response){
  routes[method].some(function(item){
    var matches = pathname.match(item.pattern);
    if (matches){
      item.method.apply(null, [request, response].concat(matches.slice(1)));
      return true;
    }
  });
};


