const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const WarriorSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    unique: true,
    set: setName,
  },
  health: {
    type: Number,
    default: 20,
    require: true,
  },
  strength: {
    type: Number,
    min: 1,
    max: 5,
    require: true,
  },
  speed: {
    type: Number,
    min: 1,
    max: 5,
    require: true,
  },
  magic: {
    type: Number,
    min: 1,
    max: 5,
    require: true,
  },
  res: {
    type: Number,
    min: 1,
    max: 5,
    require: true,
  },
  def: {
    type: Number,
    min: 1,
    max: 5,
    require: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

WarriorSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  strength: doc.strength,
  speed: doc.speed,
  magic: doc.magic,
  res: doc.res,
  def: doc.def,
});

const WarriorModel = mongoose.model('Warrior', WarriorSchema);
module.exports = WarriorModel;
