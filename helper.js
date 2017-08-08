const getImgUrl = (content) => {
  // console.log(content);

  const start = content.indexOf('src="') + 5;
  const end = content.indexOf('"', start + 10);

  if (end < start) {
    return 'https://docbao.tentstudy.xyz/images/default_news.jpg';
  }
  return content.substring(start, end);
};

module.exports = {
  getImgUrl
}
