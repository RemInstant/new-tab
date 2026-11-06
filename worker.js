'use strict';

// Context Menu
chrome.contextMenus.create({
  id: 'remove-link',
  contexts: ['link'],
  title: 'Remove this link',
  documentUrlPatterns: [
    chrome.runtime.getURL('data/override/index.html')
  ]
});
chrome.contextMenus.onClicked.addListener(() => {
  chrome.runtime.sendMessage({
    method: 'remove-link'
  });
});

/* FAQs & Feedback */
{
  const {management, runtime: {onInstalled, setUninstallURL, getManifest}, storage, tabs} = chrome;
  if (navigator.webdriver !== true) {
    const page = getManifest().homepage_url;
    const {name, version} = getManifest();
    const sv = (Date.now() / 60000).toFixed(0).slice(-3);
    onInstalled.addListener(({reason, previousVersion}) => {
      management.getSelf(({installType}) => installType === 'normal' && storage.local.get({
        'faqs': true,
        'last-update': 0
      }, prefs => {
        if (reason === 'install' || (prefs.faqs && reason === 'update')) {
          const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
          if (doUpdate && previousVersion !== version) {
            tabs.query({active: true, currentWindow: true}, tbs => tabs.create({
              url: page + '?type=' + reason + (previousVersion ? '&p=' + previousVersion : '') + '&version=' + version + '#' + sv,
              active: reason === 'install',
              ...(tbs && tbs.length && {index: tbs[0].index + 1})
            }));
            storage.local.set({'last-update': Date.now()});
          }
        }
      }));
    });
    setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
  }
}
