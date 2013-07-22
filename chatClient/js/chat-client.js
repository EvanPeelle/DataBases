var room = "messages";
var memory = {};
var friends = {};

var changeroom = function(newRoom){
  room = newRoom || "messages";
  $('.current-chat-room').text("Chatting in: " +room);
  $('#userMessages').html("");
  memory = {};
};

var receiveIt = function(){
  $.ajax({
    url:'http://127.0.0.1:8080/classes/messages',
    contentType: 'application/json',
    //data: {"order":"-createdAt","limit":"20"},
    success: function(data){
      displayMessages(data);
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });

  var boldFriends = function(){
    $('.username').each(function(index){
        $(this)[friends[$(this).text()] ? "addClass" : "removeClass"]("friend");
    });
    displayFriends();
  };

  var displayFriends = function(){
    $('#friends-list').html("");
    for(var key in friends){
      $('#friends-list').append($('<li></li>').text(key));
    }
  };

  var displayMessages = function(data) {
    for(var i = data.length-1; i >= 0; i--) {
      if(!memory.hasOwnProperty(data[i].id)){
        memory[data[i].id] = true;
        $litag = $('<li class = "chatMessage"></li>');
        $msg = $('<span class="message"></span>');
        $msg.text(data[i].message);
        $username = $('<span class="username" data-username="' + data[i].username + '"></span>');
        $username.text(data[i].username);
        $username.on('click', function(){
          if(friends[$(this).text()] === true){
            delete friends[$(this).text()];
          }else {
            friends[$(this).text()] = true;
          }
          boldFriends();
        });
        //$createdDate = $('<span class="createdAt"></span>');
        //$createdDate.text(moment(data[i].createdAt).fromNow());
        $litag.append($username,": ",$msg); //$createdDate
        $('#userMessages').append($litag);
        $('#main ul').animate({ scrollTop: $('#main ul').prop("scrollHeight") - $('#main ul').height() }, 1);
      }
    }
  };
};

var postIt = function(message) {
    $.ajax('http://127.0.0.1:8080/classes/messages',
    {contentType: "application/json",
    data: JSON.stringify(message),
    type: "POST",
    success: function(){
      console.log("success");
    },
    error: function(){
      console.log("error");
    }
  });
};

setInterval(receiveIt, 500);

$('#sendMsg').on('click',function(){
  var message = {
  'username': window.location.search.slice(window.location.search.indexOf('=')+1),
  'text': $('#writeMsg').val(),
  'roomname': 'tucker'
};
  postIt(message);
});
$('#receiveMsg').on('click',function(){
    receiveIt();
  });
$('#submitChangeRoom').on('click', function(event){
  changeroom(prompt("Where to?"));
  receiveIt();
});
