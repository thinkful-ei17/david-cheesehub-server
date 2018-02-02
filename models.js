'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const cheeseSchema = mongoose.Schema({
  name: {type: String, required: true},
});

cheeseSchema.methods.serialize = function() {
  return this.name;
};

const Cheeses = mongoose.model('Cheese', cheeseSchema);

module.exports = {Cheeses};