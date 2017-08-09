const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const rssParser = require('rss-parser');

const helper = require('./helper');

app.use(cors());

//body-parser for get data from post form
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/api/rss', (req, res) => {
  const { fetchLink, lastTime } = req.body;
  if (!fetchLink || !lastTime) {
    return res.json({ 
      success: false, 
      err: 'Please send with "fetchLink" "and lastTime"' 
    });
  }
  const checkData = helper.getCacheData(fetchLink);
  if (checkData.success) {
    return res.json({
      success: true,
      data: helper.getNewData(checkData.data, lastTime),
      lastTime: new Date(checkData.data[0].time).getTime(),
      cached: true
    });
  }
  rssParser.parseURL(fetchLink, (err, parsed) => {
    if (err) return res.json({ success: false, err });
    const listNews = parsed.feed.entries;
    let data = [];
    for (let i = 0; i < 3; i++) {
      const { title, link, contentSnippet, pubDate, content } = listNews[i];
      const imgUrl = helper.getImgUrl(content);
      data.push({
        imgUrl,
        title,
        link,
        des: contentSnippet,
        time: pubDate
      });
    }
    helper.setCacheData(fetchLink, data);
    const topTime = new Date(data[0].time).getTime();
    res.json({
      success: true,
      data: helper.getNewData(data, lastTime),
      lastTime: topTime,
      cached: false
    });
  })
});

const port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if (err) { return console.log(err); }
  console.log(`SERVER RUNNING ON PORT ${port}`);
})

