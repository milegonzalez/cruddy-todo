const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) throw error;
    var fileName = path.join(exports.dataDir, `${id}.txt`)
    fs.writeFile(fileName, text, (err) => {
      if (err) throw error;
      let todo = { id, text };
      callback(null, todo);
    });
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) throw error;
    files.forEach(file => {
      let id = file.split('.')[0];
      data.push({ id, text: id });
    });
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  var fileName = path.join(exports.dataDir, `${id}.txt`)
  fs.readFile(fileName, 'utf8', (err, text) => {
    if (err) {
      callback(`No item with id: ${id}`);
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err, text) => {
    if (err) {
      callback(`No item with id: ${id}`);
    } else {
      var fileName = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(fileName, text, (err) => {
        if (err) {
          callback(`No item with id: ${id}`);
        } else {
          callback(null, text);
        }
      });
    }
  })
};

exports.delete = (id, callback) => {
  var pathFile = path.join(exports.dataDir, `${id}.txt`)
  fs.unlink(pathFile, (err) => {
    if (err) {
      callback(`No item with id: ${id}`);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
