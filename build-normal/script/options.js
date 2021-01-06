"use strict";

let select = document.getElementById('calcMethodOption');
select.addEventListener('change', async () => {
  await chrome.storage.sync.set({
    calcMethod: {
      value: select.value,
      text: select.options[select.selectedIndex].text,
    }
  });
  main();
});

const generateOptions = (selected) => {
  const listCalcMethod = [
    { value: 'KJP', text: 'Kemenag Jakarta Pusat, Indonesia', },
    { value: 'MWL', text: 'Muslim World League', },
    { value: 'ISNA', text: 'Islamic Society of North America (ISNA)', },
    { value: 'Egypt', text: 'Egyptian General Authority of Survey', },
    { value: 'Makkah', text: 'Umm Al-Qura University, Makkah', },
    { value: 'Karachi', text: 'University of Islamic Sciences, Karachi', },
    { value: 'Tehran', text: 'Institute of Geophysics, University of Tehran', },
    { value: 'Jafari', text: 'Shia Ithna-Ashari, Leva Institute, Qum', },
  ];

  for (let item of listCalcMethod) {
    let option = document.createElement("option");
    option.text = item.text;
    option.value = item.value;
    option.selected = item.value === selected;
    select.appendChild(option);
  }
}



let locationText = document.getElementById("locationText");
let btnGetLocation = document.getElementById("getLocation");
btnGetLocation.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(_handlePossition);
  } else {
    locationText.innerHTML = "Geolocation is not supported by this browser.";
  }
});

const _handlePossition = async (position) => {
  const coords = [position.coords.latitude, position.coords.longitude];
  const city = await getCityFromCoords(coords);
  locationText.innerHTML = `${city} (${coords[0]}, ${coords[1]})`;
  chrome.storage.sync.set({
    coords: {
      value: coords,
      text: city,
    }
  });
};

const getCityFromCoords = async ([lat, long]) => {
  try {
    const data = await (await fetch('./../db/indonesiaCities.json')).json();
    const distances = data.map(item => {
      return getDistanceBetweenPointsNew(lat, long, item.latitude, item.longitude, 'Km');
    });
    const nearestDistance = Math.min(...distances);
    const indexMin = distances.indexOf(nearestDistance);
    return data[indexMin].city;
  } catch (error) {
    console.error("error", error);
  }

  function deg2rad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  function rad2deg(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
  }

  function getDistanceBetweenPointsNew(latitude1, longitude1, latitude2, longitude2, unit = 'Mi') {
    let theta = longitude1 - longitude2;
    let distance = Math.sin(deg2rad(latitude1)) * Math.sin(deg2rad(latitude2)) + Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) * Math.cos(deg2rad(theta));

    distance = Math.acos(distance);
    distance = rad2deg(distance);
    distance = distance * 60 * 1.1515;

    switch (unit) {
      case 'Mi': break;
      case 'Km': distance = distance * 1.609344;
    }
    return (Math.round(distance, 2));
  }
};

chrome.storage.sync.get(['calcMethod', 'coords'], ({ calcMethod, coords }) => {
  generateOptions(calcMethod.value);
  locationText.innerHTML = `${coords.text} (${coords.value[0]}, ${coords.value[1]})`;
});
