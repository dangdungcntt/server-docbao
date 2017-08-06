const getImgUrl = (content) => {
  // console.log(content);

  const start = content.indexOf('src="') + 5;
  const end = content.indexOf('.jpg') + 4;

  return content.substring(start, end);
};

module.exports = {
  getImgUrl
}
