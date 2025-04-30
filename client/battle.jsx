const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
import { selectedIds } from './maker.jsx';

const BattleInterface = (props) => {
  console.log(selectedIds);

  const [warriorOne, setWarriorOne] = useState({});
  const [warriorTwo, setWarriorTwo] = useState({});

  const [warriorOneHealth, setWarriorOneHealth] = useState(20);
  const [warriorTwoHealth, setWarriorTwoHealth] = useState(20);

  useEffect(() => {
    const loadWarriorFromServer = async (id, setWarrior, setWarriorHealth) => {
      const response = await fetch(`/getWarriorById?id=${id}`);
      const data = await response.json();

      setWarrior([data]);
      setWarriorHealth([data.health]);

    };
    loadWarriorFromServer(selectedIds[0], setWarriorOne, setWarriorOneHealth);
    loadWarriorFromServer(selectedIds[1], setWarriorTwo, setWarriorTwoHealth);
  }, [props.reloadWarriors]);

  const battleLogic = (aggressor, defender) => {
    console.log(aggressor.strength);
    let damage;
    let mult = 1;

    // crit calculation by comparing the speeds of both warriors
    if (Math.floor(Math.random() * aggressor.speed + 1) >= Math.floor(Math.random() * defender.speed + 1)) {
      mult = 2;
    }

    { /*
    if the warrior has better magic, calculate using 
    the magic strength stat vs resistance. Ensure damage can't
    go below 0 to prevent accidental healing.
    
    make use of random to counteract the strength of defense builds
    */ }
    if (aggressor.magic > aggressor.strength) {
      damage = Math.floor(Math.random() * aggressor.magic + 1) - Math.floor(Math.random() * (defender.res + 1) * mult);
      if (damage < 1) {
        damage = 0;
      };
    }
    else {
      //same calculation as above, instead using physical strength and defense
      damage = Math.floor(Math.random() * aggressor.strength + 1) - Math.floor(Math.random() * (defender.def + 1) * mult);
      if (damage < 1) {
        damage = 0;
      };
    }

    return damage;
  }

  return (
    <>
      <h1 id='battleTitle' className='battleTitle'>Battle!</h1>

      <section id='battleUI'>
        <h2>{warriorOneHealth}</h2>
        {/* warrior one attack logic */}
        <button onClick={() => {
          const battleTitle = document.querySelector('#battleTitle');
          const battleUI = document.querySelector('#battleUI');

          const damage = battleLogic(warriorOne[0], warriorTwo[0]);

          setWarriorTwoHealth(warriorTwoHealth - damage);

          if (warriorTwoHealth - damage <= 0) {
            battleTitle.innerHTML = `${warriorOne[0].name} Wins!`
            battleUI.innerHTML = `<form id='battleForm'
            name='returnForm'
            action='/maker'
            method='Get'
            className='returnForm'
          >
            <input type="submit" value="Return" />
          </form>`;
          }
        }}
        >Attack</button >
        <h2>{warriorTwoHealth}</h2>
        <button onClick={() => {
          const battleTitle = document.querySelector('#battleTitle');
          const battleUI = document.querySelector('#battleUI');

          const damage = battleLogic(warriorOne[0], warriorTwo[0]);

          setWarriorOneHealth(warriorOneHealth - damage);

          if (warriorOneHealth - damage <= 0) {
            battleTitle.innerHTML = `${warriorTwo[0].name} Wins!`
            battleUI.innerHTML = `<form id='returnForm'
            name='returnForm'
            action='/maker'
            method='Get'
            className='returnForm'
          >
            <input type="submit" value="Return" />
          </form>`
          }
        }}
        >Attack</button >
      </section >
    </>
  )
};


const App = () => {
  const [reloadWarriors] = useState(false);

  return (
    <>
      <div id='battleInterface'>
        <BattleInterface warriorOne={'warriorOne'} warriorTwo={'warriorTwo'} reloadWarriors={reloadWarriors} />
      </div>
    </>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
};

window.onload = init;
