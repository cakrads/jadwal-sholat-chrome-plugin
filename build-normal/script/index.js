const initPrayTimes = (storageData = {}) => {
  const { calcMethod = {}, coords = {} } = storageData;

  let date = new Date();
  prayTimes.setMethod(calcMethod.value);
  let times = prayTimes.getTimes(date, coords.value, coords.timezone);
  let list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];

  let html = '<table id="timetable">';
  html += '<tr><th colspan="2">' + date.toLocaleDateString('id-ID') + '</th></tr>';
  for (let i in list) {
    html += '<tr><td>' + list[i] + '</td>';
    html += '<td>' + times[list[i].toLowerCase()] + '</td></tr>';
  }
  html += '</table>';
  document.getElementById('table').innerHTML = html;
  document.getElementById('location').innerHTML = coords.text;
  document.getElementById('calcMethod').innerHTML = `calculation method: ${calcMethod.text}`;
}

const main = () => {
  chrome.storage.sync.get(['calcMethod', 'coords'], (storageData) => {
    initPrayTimes(storageData);
  });
}

(() => {
  main();
})();