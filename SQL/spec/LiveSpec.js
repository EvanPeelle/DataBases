/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require("request"); // You might need to npm install the request module!

describe("Persistent Node Chat Server", function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
    /* todo: Fill this out with your mysql username */
      user: "root",
    /* and password. */
      password: "",
      database: "chat"
    });
    dbConnection.connect();
    var tablename = 'messages';
    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query("DELETE FROM " + tablename,done);
    // dbConnection.query("DELETE FROM " + 'users');
    // dbConnection.query("DELETE FROM " + 'friends');
  });

  afterEach(function() {
    dbConnection.end();
  });

  it("Should insert posted messages to the DB", function(done) {
    // Post a message to the node chat server:
    var params = {method: "POST",
                  uri: "http://127.0.0.1:8080/classes/messages",
                  json: {username: "Valjean",
                         text: "In mercy's name, three days is all I need."}
                  };

    request(params,
            function(error, response, body) {
              /* Now if we look in the database, we should find the
               * posted message there. */

              var queryString = "select * from messages where username = ?";
              var queryArgs = [params.json.username];
              /* todo: Change the above queryString & queryArgs to match your schema design
               * The exact query string and query args to use
               * here depend on the schema you design, so I'll leave
               * them up to you. */
              dbConnection.query( queryString, queryArgs,
                function(err, results, fields) {
                  // Should have one result:
                  expect(results.length).toEqual(1);
                  console.log(results);
                  expect(results[0].username).toEqual("Valjean");
                  expect(results[0].message).toEqual("In mercy's name, three days is all I need.");
                  /* todo: You will need to change these tests if the
                   * column names in your schema are different from
                   * mine! */

                  done();
                });
            });
  });

  it("Should output all messages from the DB", function(done) {
    // Let's insert a message into the db
    var queryString = "insert into messages (username, message) values (?,?)";
    var queryArgs = ["Javert", "Men like you can never change!"];
    /* todo - The exact query string and query args to use
     * here depend on the schema you design, so I'll leave
     * them up to you. */

    dbConnection.query( queryString, queryArgs,
      function(err, results, fields) {
        /* Now query the Node chat server and see if it returns
         * the message we just inserted: */
        request("http://127.0.0.1:8080/classes/messages",
          function(error, response, body) {
            console.log(body);  
            var messageLog = JSON.parse(body);
            expect(messageLog[0].username).toEqual("Javert");
            expect(messageLog[0].message).toEqual("Men like you can never change!");
            done();
          });
      });
  });
});
