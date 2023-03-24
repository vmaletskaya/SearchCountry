
import './css/styles.css';
import { fetchCountries, showSpinner } from './fetchCountries.js';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  inputField: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfoCard: document.querySelector('.country-info'),
};

refs.inputField.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
refs.inputField.addEventListener('keyup', onRemoveInputValue);
refs.inputField.addEventListener('click', resetAll);

function onInput(event) {
  let inputValue = refs.inputField.value.toLowerCase().trim();

  if (inputValue === '') {
    resetAll();
    return;
  }
  fetchCountries(inputValue)
    .then(e => {
      if (!e) {
        return;
      } else if (e.length > 10 && e.length !== undefined) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.',
          { timeout: 1000, width: '390px', titleFontSize: '18px' }
        );
        return;
      } else if (e.length > 2 && e.length < 10) {
        showSpinner('none');
        listIsVisible();
        e.map(el => {
          listMarkup(el);
          removeCard();
          removeNotiflix();
        });
        document
          .querySelector('.country-list.isVisible')
          .addEventListener('click', onLinkClick);
      } else if (e.length < 2) {
        e.map(cardMarkup);
        removeNotiflix();
        showSpinner('none');
        removeCountryList();
      }
    })
    .catch(removeCard());
}
function onLinkClick(e) {
  refs.inputField.value = '';
  const selectedCountry = e.target.textContent;

  fetchCountries(selectedCountry).then(el => {
    removeCountryList();
    refs.countryList.classList.add('isVisible');
    cardMarkup(el[0]);
  });
}
function cardMarkup(obj) {
  refs.countryList.classList.remove('isVisible');
  refs.countryInfoCard.insertAdjacentHTML(
    'beforeend',
    `<a class ="card" href=${obj.link} target="_blank">
            <div>
                <img src = "${obj.flag}" alt="Flag" width="600" height="300"/>
            </div>
            <ul>
                <li><p>Населення:</p> ${obj.population} людей</li>
                <li><p>Мови:</p> ${obj.language}</li>
            </ul>
            <ol class="bottom-fr">
              <li><splan class ="country">${obj.nameOfficial}</span></li>
              <li><p>Cтолиця:</p> ${obj.capital}</li>
            </ol>
    </a>`
  );
}
function listMarkup(obj) {
  refs.countryList.insertAdjacentHTML(
    'beforeend',
    `<li><img src = "${obj.flag}" alt="Flag" width="45"/>${obj.nameOfficial}</li>`
  );
}
function listIsVisible() {
  return refs.countryList.classList.add('isVisible');
}
function removeNotiflix() {
  if (document.querySelector('#NotiflixNotifyWrap')) {
    document.querySelector('#NotiflixNotifyWrap').style.display = 'none';
  }
}
function removeCountryList() {
  refs.countryList.innerHTML = '';
}
function removeCard() {
  refs.countryInfoCard.innerHTML = '';
}
function resetAll() {
  refs.inputField.value = '';
  refs.countryInfoCard.innerHTML = '';
  refs.countryList.innerHTML = '';
  refs.countryList.classList.remove('isVisible');
}
function onRemoveInputValue(e) {
  showSpinner('none');
  if (e.key == 'Backspace' || e.key == 'Delete') {
    refs.inputField.value = '';
  }
}