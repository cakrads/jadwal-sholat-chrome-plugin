chrome.runtime.onInstalled.addListener(function () {
  const defaultValue = {
    calcMethod: {
      value: 'KJP',
      text: 'Kemenag Jakarta Pusat, Indonesia'
    },
    coords: {
      value: [-6.564910502033864, 106.72985166512684],
      text: 'Dramga, Kab. Bogor',
      timezone: 7, // Jakarta
    }
  }

  chrome.storage.sync.set(defaultValue, async () => {
    console.log('The default calculate Method is Kemenag Jakarta Pusat.');
  });
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  //   chrome.declarativeContent.onPageChanged.addRules([{
  //     conditions: [new chrome.declarativeContent.PageStateMatcher({
  //       pageUrl: { hostEquals: 'developer.chrome.com' },
  //     })
  //     ],
  //     actions: [new chrome.declarativeContent.ShowPageAction()]
  //   }]);
  // });
});