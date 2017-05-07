var api_key = 'key-1f61d27c23b9b7992c8857b9644f428f';
var domain = 'sandbox0b80230d11cd45b69d7d43038cc1cb6f.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var contactEvent = require('./events');

var  messageHandler = function(m) {
         // The Payload
        var data = {
            from: 'WIT BSc IT <postmaster@sandbox0b80230d11cd45b69d7d43038cc1cb6f.mailgun.org>',
            to: 'barrysher1@hotmail.com', /*JSON.parse(m).email*/ 
            subject: 'Welcome to ScoreFinder',
            text: 'A new fixture has been added to the application.'
          };

          mailgun.messages().send(data, function (error, body) {
            console.log(body);
          });
        }

contactEvent.subscribe('create_contact_event', messageHandler)      

