var express = require('express');
var app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
var rssParser = require('rss-parser');
app.use(cors());
//body-parser for get data from post form
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/api/rss', (req, res) => {
  const { fetchLink, lastTime } = req.body;
  // console.log(lastTime);
  if (!fetchLink || !lastTime) return res.json({ success: false, err: 'Please send with "fetchLink" "and lastTime"' });
  rssParser.parseURL(fetchLink, (err, parsed) => {
    if (err) return res.json({ success: false, err });
    const listNews = parsed.feed.entries;
    if (new Date(listNews[0].pubDate).getTime() == lastTime) {
      return res.json({
        success: true,
        data: [],
        lastTime,
        msg: 'up-to-date'
      });
    }
    var data = [];
    for (var i = 0; i < 3; i++) {
      const { title, link, contentSnippet, pubDate } = listNews[i];
      if (new Date(pubDate).getTime() > lastTime) {
        data.push({
          title,
          link,
          des: contentSnippet,
          time: pubDate
        });
      }
    }
    console.log(new Date(listNews[0].pubDate).getTime());
    res.json({
      success: true,
      data,
      lastTime: new Date(listNews[0].pubDate).getTime()
    });
    // console.log(JSON.stringify(parsed));
    
  })
});


var port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if (err) { return console.log(err); }
  console.log(`SERVER RUNNING ON PORT ${port}`);
})

