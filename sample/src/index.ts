import Carousel from 'cute-clever-carousel';
import {Options} from '../../lib/Options';
import queryString = require('query-string');

const optionsElement = document.getElementById('options');

const options: Options = {
  transitionDurationSec: 0.5,
  transitionTimingFunction: 'ease',
  scrollDeltaCoefficient: 1,
  inertia: true,
  inertiaAcceleration: 0.005,
  inertiaIntervalMS: 16
};

const query = queryString.parse(location.search);
// init options input
Object.keys(options).forEach(optionKey => {
  const tr = document.createElement('tr');
  const labelTd = document.createElement('td');
  const label = document.createElement('span');
  label.innerText = optionKey;
  labelTd.appendChild(label);
  tr.appendChild(labelTd);

  const inputTd = document.createElement('td');
  const input = document.createElement('input');
  input.name = optionKey;
  input.value = typeof query[optionKey] !== 'undefined' ? query[optionKey] : options[optionKey];
  input.addEventListener('change', update);
  inputTd.appendChild(input);
  tr.appendChild(inputTd);
  optionsElement.appendChild(tr);
});

let carouselInstance: Carousel = null;
function update() {
  const inputs = optionsElement.getElementsByTagName('input');
  const options = {};
  for (let i = 0; i < inputs.length; ++i) {
    const input = inputs.item(i);
    switch (input.name) {
      // float
      case 'transitionDurationSec':
      case 'scrollDeltaCoefficient':
      case 'inertiaAcceleration':
      case 'inertiaIntervalMS':
        options[input.name] = parseFloat(input.value);
        break;
      // boolean
      case 'inertia':
        options[input.name] = input.value === 'true';
        break;
      default:
        options[input.name] = input.value;
    }
  }
  console.log('initialized', options);
  if (carouselInstance) {
    carouselInstance.destroy();
  }
  carouselInstance = new Carousel(document.getElementsByClassName('carousel')[0], options);
}

update();
