var SlackBot = require('slackbots');
var http = require('http');

//Your data about the space
var space = "Chaostreff Flensburg",
logo = "https://chaostreff-flensburg.de/wp-content/uploads/2017/04/cropped-cropped-Leuchtturmrakete-02-1.png",
url = "https://chaostreff-flensburg.de/",
address = "Apenrader Str. 49, 24939 Flensburg",
lat = 54.8045,
lon = 9.42341,
twitter = "@chaos_fl",
mail = "mail@chaostreff-flensburg.de",
issue_mail = "mail@chaostreff-flensburg.de",
// http token
httptoken = "somerandomstring",
//Blog Feed
feedType = "application/rss+xml",
feedUrl = "https://chaostreff-flensburg.de/feed/",
//Calendar
calType = "ical",
calUrl = "https://calendar.google.com/calendar/ical/asgooqntcboot4uta3jvt30vus%40group.calendar.google.com/public/basic.ics";

// Slack credentials and trigger words
var token = 'YOUR_TOKEN', //Token of your slackbot
botName = 'YOUR_BOTNAME', //Name of your bot
channelId = 'YOUR_CHANNELID',
triggerOpen = 'Space ist auf!',
triggerClose = 'Space ist ab jetzt geschlossen!',
readchannel = false,
postchannel = false;

var state = null;
var lasttime = Math.floor(new Date() / 1000);
var jsonstatic = {};
function make_json() {
  jsonstatic = {
    "api": "0.13",
    "space": space,
    "logo": logo,
    "url": url,
    "location" : {
      "address": address,
      "lat" : lat,
      "lon" : lon
    },
    "contact" : {
      "twitter": twitter,
      "email": mail,
      "issue_mail": issue_mail
    },
    "issue_report_channels": [
      "issue_mail"
    ],
    "state":{
      "open": state,
      "lastchange": lasttime,
      "icon":{
        "open":"",
        "closed":""
      },
    },
    "feeds": {
      "blog": {
        "type": feedType,
        "url": feedUrl
      },
      "calendar": {
        "type": calType,
        "url": calUrl
      }
    }
  };
  return jsonstatic;
};

if(readchannel == true || postchannel == true)
{
  var bot = new SlackBot({
    token: token,
    name: botName
  });
}
if(readchannel == true)
{
  bot.on('message', function(data) {
    if (data.type == 'message' && data.channel == channelId && data.text == triggerOpen)
    {
      // Space ist offen
      state = true;
      lasttime = Math.floor(new Date() / 1000);
    }
    if (data.type == 'message' && data.channel == channelId && data.text == triggerClose)
    {
      // Space ist geschlossen
      state = false;
      lasttime = Math.floor(new Date() / 1000);
    }
  });
}

var app = http.createServer(anwser_request);

function anwser_request(req,res)
{
  var parseurl = require('url').parse(req.url, true);
  // favicon.ico return 
  if(parseurl.path == "/favicon.ico")
  {
    res.end();
    return;
  }
  // Http state change
  if(typeof parseurl.query.httptopen !== 'undefined' && typeof parseurl.query.state !== 'undefined' && parseurl.query.httptopen == httptoken)
  {
    if(parseurl.query.state == "open")
      state = true;
    if(parseurl.query.state == "close")
      state = false;
    res.write("OK state is now:" + state);
    // Schreibe im Slack Channel die Status Änderung
    if(postchannel == true)
      bot.postMessageToChannel(channelId, 'Space ist jetzt ' . parseurl.query.state); 
    res.end();
    return;
  }
  // Send json
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(make_json(), null, 3));
  res.end();
}
app.listen(8700);
