import Carousel, {SlideEvent} from 'cute-clever-carousel';
import queryString = require('query-string');
import {defaultOptions} from '../../lib/Options';

const optionsElement = document.getElementById('options');

const query = queryString.parse(location.search);
// init options input
Object.keys(defaultOptions).forEach(optionKey => {
  if (optionKey === 'frameClassName' || optionKey === 'itemsClassName') {
    return;
  }
  const tr = document.createElement('tr');
  const labelTd = document.createElement('td');
  const label = document.createElement('span');
  label.innerText = optionKey;
  labelTd.appendChild(label);
  tr.appendChild(labelTd);

  const inputTd = document.createElement('td');
  const input = document.createElement('input');
  input.name = optionKey;
  input.value = typeof query[optionKey] !== 'undefined' ? query[optionKey] : defaultOptions[optionKey];
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

  carouselInstance.on('slideEnd', (event: SlideEvent) => {
    console.log('event:slideEnd', event);
  });
}

document.getElementsByClassName('prev-button')[0].addEventListener('click', () => {
  carouselInstance.prev();
});
document.getElementsByClassName('next-button')[0].addEventListener('click', () => {
  carouselInstance.next();
});

update();
