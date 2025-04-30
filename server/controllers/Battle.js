const models = require('../models');

const { Warrior } = models;

const battlePage = async (req, res) => {
  try {
    const warriorOne = await Warrior.findOne({ _id: req.query.firstwarrior });
    const warriorTwo = await Warrior.findOne({ _id: req.query.secondwarrior });

    res.render('battle', {
      warriorOne,
      warriorTwo,
    });
  } catch (err) {
    console.error(err);
  }
};

const getWarriorById = async (req, res) => {
  try {
    const warrior = await Warrior.findOne({ _id: req.query.id }, 'name health strength speed magic res def').lean().exec();

    console.log(warrior);

    return res.status(200).json(warrior);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving warriors!' });
  }
};

module.exports = {
  battlePage,
  getWarriorById,
};
