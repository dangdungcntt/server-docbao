let cacheData = [];

const getCacheData = (key) => {
  const curTime = new Date().getTime();
  const item = cacheData[key];
  if (item && item.expire >= curTime) {
    return {
      success: true,
      data: item.value
    }
  }
  return {
    success: false
  }
};

const setCacheData = (key, value) => {
  cacheData[key] = {
    value,
    expire: new Date().getTime() + 50 * 1000
  };
};

const getNewData = (data, lastTime) => {
  return data.filter((item) => {
    return new Date(item.time).getTime() > lastTime;
  });
};

const getImgUrl = (content) => {
  const start = content.indexOf('src="') + 5;
  const end = content.indexOf('"', start + 10);
  if (end < start) {
    return 'https://docbao.tentstudy.xyz/images/default_news.jpg';
  }
  return content.substring(start, end);
};

module.exports = {
  getImgUrl,
  getCacheData,
  setCacheData,
  getNewData
}
