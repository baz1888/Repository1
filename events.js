'use strict';
// Pubnub service configuration
// ===========================

var PubNub = require('pubnub');

var pubnub = new PubNub({
            publishKey : 'pub-c-2b1db291-a0ef-4b3d-a07f-d40bc43f76c7',
            subscribeKey : 'sub-c-6115551a-0284-11e7-b54e-0619f8945a4f',
            secretKey: "sec-c-ZjgyMzAxYWYtYjlmOC00ZmE1LTk5YmQtZTIzZWUxMGM1NmVj",
            ssl: true
});

module.exports = {
  publish: function(channel, message){
    pubnub.publish({
             channel: channel,
             message: JSON.stringify(message)},
             function(status, response) {
               if (status.error) {
                 console.log(status)
               } else {
                 console.log("message Published with timetoken: ", response.timetoken)
               }
             });
  },
  subscribe: function(channel, callback){

    pubnub.addListener({

        message: function(m) {
            // handle message

            var msg = m.message; // The Payload

            callback(msg);
            }
  });
    // Subscribe to the demo_tutorial channel
    pubnub.subscribe({
        channels: [channel]
    });
  }
}