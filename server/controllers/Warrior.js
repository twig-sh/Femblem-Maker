// this code is altered from DomoMaker
const models = require('../models');

const { Warrior } = models;

const makerPage = (req, res) => res.render('app');

const makeWarrior = async (req, res) => {
  if (!req.body.name || !req.body.strength || !req.body.speed
    || !req.body.magic || !req.body.resistance || !req.body.defense) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const warriorData = {
    name: req.body.name,
    strength: req.body.strength,
    speed: req.body.speed,
    magic: req.body.magic,
    res: req.body.resistance,
    def: req.body.defense,
    owner: req.session.account._id,
  };

  try {
    const newWarrior = new Warrior(warriorData);
    await newWarrior.save();
    return res.status(201).json({
      name: newWarrior.name,
      strength: newWarrior.strength,
      speed: newWarrior.speed,
      magic: newWarrior.magic,
      res: newWarrior.res,
      def: newWarrior.def,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Warrior already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making warrior!' });
  }
};

const getWarriors = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Warrior.find(query).select('name strength speed magic res def').lean().exec();

    return res.json({ warriors: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving warriors!' });
  }
};

module.exports = {
  makerPage,
  makeWarrior,
  getWarriors,
};
