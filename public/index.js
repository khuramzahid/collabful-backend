$(function() {
  var username;

  print('Logging in...');

  $.getJSON('/token', (data) => {
    Twilio.Chat.Client.create(data.token).then(chatClient => {
        print('Chat client created.');
        chatClient.getSubscribedChannels().then(() => {
          print('Attempting to join "general" chat channel...');
          chatClient.getChannelByUniqueName('general')
          .then((channel) => {
            print('"general" channel found.');
            setupChannel(channel);
          }).catch((channel) => {
            print('"general" channel not found. Creating one ...');
            chatClient.createChannel({
              uniqueName: 'general',
              friendlyName: 'General Chat Channel'
            }).then((channel) => {
              print('"general" channel created.');
              setupChannel(channel);
            }).catch((channel) => {
              print('"general" channel could not be created.');
            });
          });
        });

        chatClient.on('tokenAboutToExpire', () => {
          print('Token about to expire');
          $.getJSON('/token/' + username, (data) => {
            print('updated token for chat client');          
            chatClient.updateToken(data.token);
          });
        });

        chatClient.on('tokenExpired', () => {
          print('Token expired');
          $.getJSON('/token/' + username, (data) => {
            print('updated token for chat client');          
            chatClient.updateToken(data.token);
          });
        });

        username = data.identity;
        print('You have been assigned a random username of: ' + '<span class="me">' + username + '</span>', true);
      })
      .catch((channel) => {
        print('There was an error creating the chat client:<br/>', true);
        print('Please check your .env file.', false);
      });
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  function print(infoMessage, asHtml) {
    var $msg = $('<div class="info">');
    if (asHtml) {
      $msg.html(infoMessage);
    } else {
      $msg.text(infoMessage);
    }
    $('#messages').append($msg);
  }

  function printMessage(fromUser, message) {
    var $user = $('<span class="username">').text(fromUser + ':');
    if (fromUser === username) {
      $user.addClass('me');
    }
    var $message = $('<span class="message">').text(message);
    var $container = $('<div class="message-container">');
    $container.append($user).append($message);
    $('#messages').append($container);
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  }

  function setupChannel(channel) {
    channel.join().then(() => {
      print('Joined channel as ' + '<span class="me">' + username + '</span>.', true);
    });

    channel.on('messageAdded', (message) => {
      printMessage(message.author, message.body);
    });

    $('#chat-input').on('keydown', (e) => {
      if (e.keyCode == 13) {
        channel.sendMessage($('#chat-input').val())
        $('#chat-input').val('');
      }
    });
  }
});