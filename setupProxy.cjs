const express = require('express');
const apiMocker = require('connect-api-mocker');
const path = require('path');

module.exports = (middlewares, dev) => {
  middlewares.unshift(
    express.json(),
    apiMocker(path.join(__dirname, 'mocks'))
  );
  return middlewares;
};
