

module.exports = {
  async method() {
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 500);
    });

    return Math.random();
  }
};
