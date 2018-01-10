var SlackBot = require('slackbots');
var http = require('http');

var state = null;
var lasttime = Math.floor(new Date() / 1000);
var jsonstatic = {};
function make_json() {
        jsonstatic = {
                        "api": "0.13",
                        "space": "",
                        "logo": "",
                        "url": "",
                        "location" : {
                                "address": "",
                                "lat" : 1,
                                "lon" : 1
                        },
                        "contact" : {
                                "twitter": "",
                                "email": "",
                                "issue_mail": ""
                        },
                        "issue_report_channels": [
                                "issue_mail"
                        ],
                        "state":{
                                "open": state,
                                "icon":{
                                              "open":"",
                                              "closed":""
                                },
                        },
                        "lastchange": lasttime
                 };
        return jsonstatic;
};

// create a bot
var bot = new SlackBot({
    token: 'xoxb-', // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'spaceopenread'
});

bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
//    console.log(data);
        if(data.type == 'message' && data.channel == '' && data.text == '')
        {
                // Space ist offen
                state = 'open';
                lasttime = Math.floor(new Date() / 1000);
        }
        if(data.type == 'message' && data.channel == '' && data.text == '')
        {
                // Space ist geschlossen
                state = 'close';
                lasttime = Math.floor(new Date() / 1000);
        }
});

var app = http.createServer(function(req,res){
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(make_json(), null, 3));
    res.end();
});
app.listen(8700);
