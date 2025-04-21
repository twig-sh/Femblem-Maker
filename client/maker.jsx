const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

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

  helper.sendPost(e.target.action, { name, strength, speed, magic, resistance, defense }, onWarriorAdded);
  return false;
};

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
      <label htmlFor='magic'>Magic: </label>
      <input id='warriorMagic' type='number' min='0' name='magic' />
      <label htmlFor='speed'>Speed: </label>
      <input id='warriorSpeed' type='number' min='0' name='speed' />
      <label htmlFor='defense'>Defense: </label>
      <input id='warriorDefense' type='number' min='0' name='defense' />
      <label htmlFor='resistance'>Resistance: </label>
      <input id='warriorResistance' type='number' min='0' name='resistance' />
      <input className='makeWarriorSubmit' type='submit' value='Make Warrior' />
    </form>
  );
};

const WarriorList = (props) => {
  const [warriors, setWarriors] = useState(props.warriors);

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
      <div key={warrior._id} data-id={warrior._id} className='warrior'>
        <img src='/assets/img/warriorface.jpeg' alt='warrior sprite' className='warriorSprite' />
        <h3 className='warriorName'>Name: {warrior.name}</h3>
        <h3 className='warriorStrength'>Strength: {warrior.strength}</h3>
        <h3 className='warriorMagic'>Magic: {warrior.magic}</h3>
        <h3 className='warriorSpeed'>Speed: {warrior.speed}</h3>
        <h3 className='warriorResistance'>Resistance: {warrior.res}</h3>
        <h3 className='warriorDefense'>Defense: {warrior.def}</h3>
      </div >
    );
  });

  return (
    <div className='warriorList'>
      {warriorNodes}
    </div>
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