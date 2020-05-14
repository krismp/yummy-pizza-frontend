console.log({
  API_BASE_URL: process.env.API_BASE_URL,
})

module.exports = {
  publicRuntimeConfig: {
    // Will only be available on the server side
    API_BASE_URL: process.env.API_BASE_URL,
  },
};
