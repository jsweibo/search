let config = null;

const qInput = document.querySelector('#q');

function handle(userInput) {
  // find a bang
  let pieces = userInput.split(/\s+/);
  let bang = '';
  let piecesIndex = -1;
  pieces.findIndex(function (item, index) {
    if (item.indexOf('!') === 0 || item.indexOf('！') === 0) {
      bang = item.substr(1).toLowerCase();
      piecesIndex = index;
      return true;
    }
  });

  // affirm that the bang is valid
  let rulesIndex = -1;
  let keywords = '';
  config.rules.findIndex(function (item, index) {
    if (item[0] === bang) {
      // the bang is valid
      rulesIndex = index;
      pieces.splice(piecesIndex, 1);
      keywords = pieces.join(' ');
      return true;
    }
  });

  // the bang is invalid
  if (rulesIndex < 0) {
    rulesIndex = config.index;
    keywords = userInput;
  }

  // go
  location.href = config.rules[rulesIndex][1] + encodeURIComponent(keywords);
}

document.querySelector('#q+button').addEventListener('click', function () {
  qInput.value = '';
});

document.querySelector('#open-options').addEventListener('click', function () {
  open('options.html');
});

document.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault();

  if (config) {
    handle(qInput.value.trim());
  } else {
    notify({
      type: 'error',
      message: 'Config is Required',
    });
  }
});

window.addEventListener('storage', function (event) {
  if (event.key === 'config') {
    config = JSON.parse(event.newValue);
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function (error) {
      console.log(error);
    });
  });
}

// start
const configText = localStorage.getItem('config');
if (configText) {
  config = JSON.parse(configText);
}
if (location.search && URLSearchParams) {
  // parse url search string
  const q = new URLSearchParams(location.search).get('q');
  if (q) {
    if (config) {
      handle(q.trim());
    } else {
      notify({
        type: 'error',
        message: 'Config is Required',
      });
    }
  }
} else {
  // if not mobile, auto focus on input
  if (!/mobile/i.test(navigator.userAgent)) {
    qInput.focus();
  }
}
