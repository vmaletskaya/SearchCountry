export { fetchCountries, showSpinner};
import Notiflix from 'notiflix';

function fetchCountries(name) {
  showSpinner();
  return fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(response => {

      return response.json();
    })
    .then(data => {
      let obj = data.map(e => {
        const nameOfficial = e.name.official;
        let capital = e.capital;
        const population = e.population;
        const flag = e.flags.svg;
        const language = Object.values(e.languages)
          .toString()
          .split(',')
          .join(', ');
        const link = e.maps.googleMaps;
        return { nameOfficial, capital, population, flag, language, link };
      });
      showSpinner("none")
      return obj;
    }).catch(e => {
      showSpinner("none"),
      Notiflix.Notify.failure(`Nothing found for your request`)
    })
    
}

function showSpinner(val) {
  if (val === 'none') {
    document.querySelector('.lds-dual-ring').style.cssText='opacity: 0';
    return
  }
  document.querySelector('.lds-dual-ring').style.cssText=' opacity: 1';
}