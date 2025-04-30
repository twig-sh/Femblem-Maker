const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

let selectedIds = [];

// handle creation of warriors using the on page form
const handleWarrior = (e, onWarriorAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#warriorName').value;
  const strength = e.target.querySelector('#warriorStrength').value;
  const magic = e.target.querySelector('#warriorMagic').value;
  const speed = e.target.querySelector('#warriorSpeed').value;
  const defense = e.target.querySelector('#warriorDefense').value;
  const resistance = e.target.querySelector('#warriorResistance').value;

  if (!name || !strength || !magic || !speed || !defense || !resistance) {
    helper.handleError('All fields are required');
    return false;
  }

  if (Number(strength) + Number(magic) + Number(speed) + Number(defense) + Number(resistance) > 15) {
    helper.handleError('All stats must add to a max of 15!');
    return false;
  }

  helper.sendPost(e.target.action, { name, strength, speed, magic, resistance, defense }, onWarriorAdded);
  return false;
};

// check that two warriors are selected, the send a post to send their
// ids to the battle screen
const handleBattleTransition = async (e) => {
  e.preventDefault();

  if (selectedIds.length === 2) {
    const warriorOne = selectedIds[0];
    const warriorTwo = selectedIds[1];

    helper.sendPost('/battle', { warriorOne, warriorTwo });
  }
  else {
    helper.handleError('Two warriors must be selected for battle!');
  }
  return false;
}

const WarriorForm = (props) => {
  return (
    <form id='warriorForm'
      onSubmit={(e) => handleWarrior(e, props.triggerReload)}
      name='warriorForm'
      action='/maker'
      method='POST'
      className='warriorForm'
    >
      <label htmlFor='name'>Name: </label>
      <input id='warriorName' type='text' name='name' placeholder='Warrior Name' />
      <label htmlFor='strength'>Strength: </label>
      <input id='warriorStrength' type='number' min='0' max='5' name='strength' />
      <label htmlFor='magic'>Magic: </label>
      <input id='warriorMagic' type='number' min='0' max='5' name='magic' />
      <label htmlFor='speed'>Speed: </label>
      <input id='warriorSpeed' type='number' min='0' max='5' name='speed' />
      <label htmlFor='defense'>Defense: </label>
      <input id='warriorDefense' type='number' min='0' max='5' name='defense' />
      <label htmlFor='resistance'>Resistance: </label>
      <input id='warriorResistance' type='number' min='0' max='5' name='resistance' />
      <input className='makeWarriorSubmit' type='submit' value='Make Warrior' />
    </form>
  );
};

// handle creation and selection of warriors
const WarriorList = (props) => {
  const [warriors, setWarriors] = useState(props.warriors);
  const [selectedWarriors, setSelectedWarriors] = useState([]);

  useEffect(() => {
    const loadWarriorsFromServer = async () => {
      const response = await fetch('/getWarriors');
      const data = await response.json();
      setWarriors(data.warriors);
    };
    loadWarriorsFromServer();
  }, [props.reloadWarriors]);

  if (warriors.length === 0) {
    return (
      <div className='warriorList'>
        <h3 className='emptyWarrior'>No Warriors Yet!</h3>
      </div>
    );
  }


  const warriorNodes = warriors.map(warrior => {
    return (
      <div key={warrior._id} data-id={warrior._id} className='warrior' onClick={() => {
        if (selectedWarriors.length === 2) {
          helper.handleError('Only two warriors can be selected!')
          return false
        }
        setSelectedWarriors(
          [
            ...selectedWarriors,
            warrior
          ]
        );

        selectedIds.push(warrior._id);
      }}>
        <img src='/assets/img/warrior.png' alt='warrior sprite' className='warriorSprite' />
        <h3 className='warriorName'>Name: {warrior.name}</h3>
        <h3 className='warriorStrength'>Strength: {warrior.strength}</h3>
        <h3 className='warriorMagic'>Magic: {warrior.magic}</h3>
        <h3 className='warriorSpeed'>Speed: {warrior.speed}</h3>
        <h3 className='warriorResistance'>Resistance: {warrior.res}</h3>
        <h3 className='warriorDefense'>Defense: {warrior.def}</h3>
      </div >
    );
  });

  const selectedWarriorNodes = selectedWarriors.map(warrior => {
    return (
      <div key={warrior._id} data-id={warrior._id} className='warrior'>
        <img src='/assets/img/warrior.png' alt='warrior sprite' className='warriorSprite' />
        <h3 className='warriorName'>Name: {warrior.name}</h3>
        <h3 className='warriorStrength'>Strength: {warrior.strength}</h3>
        <h3 className='warriorMagic'>Magic: {warrior.magic}</h3>
        <h3 className='warriorSpeed'>Speed: {warrior.speed}</h3>
        <h3 className='warriorResistance'>Resistance: {warrior.res}</h3>
        <h3 className='warriorDefense'>Defense: {warrior.def}</h3>
      </div>
    )
  });

  return (
    <section className='warriorLists'>
      <div className='selectedWarriorList'>
        <h2>Selected Warriors</h2>
        {selectedWarriorNodes}
      </div>
      <div>
        <form id='battleForm'
          name='battleForm'
          action='/battle'
          onClick={handleBattleTransition}
          method='get'
          className='battleForm'
        >
          <input type="submit" value="Battle!" />
        </form>
      </div>
      <hr />
      <div className='warriorList'>
        <h2>All Warriors</h2>
        {warriorNodes}
      </div>
    </section>
  );
};

const App = () => {
  const [reloadWarriors, setReloadWarriors] = useState(false);

  return (
    <div>
      <div id='makeWarrior'>
        <WarriorForm triggerReload={() => setReloadWarriors(!reloadWarriors)} />
      </div>
      <div id='warriors'>
        <WarriorList warriors={[]} reloadWarriors={reloadWarriors} />
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
};

window.onload = init;