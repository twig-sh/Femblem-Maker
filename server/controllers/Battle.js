const models = require('../models');

const { Warrior } = models;

// transfer the selected warrior ids to the battle screen
const battlePageTransition = async (req, res) => {
  const { warriorOne, warriorTwo } = req.body;

  return res.json({ redirect: `/battle?warriorOne=${warriorOne}&warriorTwo=${warriorTwo}` });
};

// render the battle page
const battlePage = async (req, res) => {
  try {
    res.render('battle', {
      warriorOne: req.query.warriorOne,
      warriorTwo: req.query.warriorTwo,
    });
  } catch (err) {
    console.error(err);
  }
};

// GET a warrior using their id
const getWarriorById = async (req, res) => {
  try {
    const warrior = await Warrior.findOne({ _id: req.query.id }, 'name health strength speed magic res def').lean().exec();

    return res.status(200).json(warrior);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving warriors!' });
  }
};

module.exports = {
  battlePage,
  getWarriorById,
  battlePageTransition,
};
