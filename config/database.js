var env = process.env;
var nodeEnv = env.NODE_ENV || 'development';

exports.nodeEnv;

exports.logStars = function(message) {
  console.info('**********');
  console.info(message);
  console.info('**********');
};

exports.port = env.PORT || 8000;
exports.host = env.HOST || 'localhost';

exports.secret= 'secretkeyforfootballapi';
exports.database ='mongodb://admin:celtic@ds163699.mlab.com:63699/footballleagueapi';