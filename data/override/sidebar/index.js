'use strict';
{
  const sidebar = document.getElementById('sidebar');

  document.addEventListener('click', ({target}) => {
    if (target.dataset.id === 'sidebar') {
      sidebar.dataset.open = true;
    }
    else {
      sidebar.dataset.open = sidebar.contains(target);
    }
  });
}
const style = document.createElement('style');
style.textContent = localStorage.getItem('userstyle') || '';
document.documentElement.appendChild(style);

document.getElementById('userstyle').value = style.textContent;
chrome.storage.local.get({
  'zip': '',
  'position': {},
  'city': '',
  'weather': false,
  'units': 'metric',
  'accurate': false,
  'lang': chrome.i18n.getUILanguage(),
  'custom-bg': false,
  'time-format': 'hh:mm:ss',
  'date-format': 'full'
}, prefs => {
  document.getElementById('prefs.latitude').value = prefs.position.lat || '';
  document.getElementById('prefs.longitude').value = prefs.position.lon || '';
  document.getElementById('prefs.city').value = prefs.city;
  document.getElementById('prefs.weather').checked = prefs.weather;
  document.getElementById('prefs.units').value = prefs.units;
  document.getElementById('prefs.accurate').checked = prefs.accurate;
  document.getElementById('prefs.lang').value = prefs.lang;
  document.getElementById('custom-bg').checked = prefs['custom-bg'];
  document.getElementById('time-format').value = prefs['time-format'];
  document.getElementById('date-format').value = prefs['date-format'];
});
{
  const status = document.getElementById('status');
  document.getElementById('save').addEventListener('click', () => chrome.storage.local.set({
    'position': {
      lat: document.getElementById('prefs.latitude').value,
      lon: document.getElementById('prefs.longitude').value
    },
    'city': document.getElementById('prefs.city').value,
    'weather': document.getElementById('prefs.weather').checked,
    'units': document.getElementById('prefs.units').value,
    'accurate': document.getElementById('prefs.accurate').checked,
    'lang': document.getElementById('prefs.lang').value,
    'api': null,
    'date': null,
    'custom-bg': document.getElementById('custom-bg').checked,
    'time-format': document.getElementById('time-format').value,
    'date-format': document.getElementById('date-format').value
  }, () => {
    style.textContent = document.getElementById('userstyle').value;
    localStorage.setItem('userstyle', style.textContent);

    status.textContent = 'Options saved';
    window.setTimeout(() => status.textContent = '', 750);
  }));
  // reset
  document.getElementById('reset').addEventListener('click', e => {
    if (e.detail === 1) {
      status.textContent = 'Double-click to reset!';
      window.setTimeout(() => status.textContent = '', 750);
    }
    else {
      localStorage.clear();
      chrome.storage.local.clear(() => {
        chrome.runtime.reload();
        window.close();
      });
    }
  });
  // support
  document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
    url: chrome.runtime.getManifest().homepage_url + '&rd=donate'
  }));
}

document.getElementById('image').onchange = e => {
  if (e.target.value) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('custom-bg').checked = true;
      chrome.storage.local.set({
        'custom-bg': true,
        'custom-image': reader.result
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  }
};
