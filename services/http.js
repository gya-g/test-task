class Http {
  static get = async (url) => {
    try {
      const res = await fetch(url);

      return res.json();
    } catch (e) {
      console.log(e);
    }
  };
}

module.exports = {
  Http,
}
