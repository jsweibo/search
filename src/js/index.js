let config = null;

const qInput = document.querySelector('#q');

function start() {
  const configText = localStorage.getItem('config');
  if (configText) {
    try {
      config = JSON.parse(configText);
    } catch (error) {
      notify({
        type: 'error',
        message: error.message,
      });
      return false;
    }
  } else {
    localStorage.setItem('config', JSON.stringify(DEFAULT_SETTINGS, null, 2));
    config = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  if (location.search && URLSearchParams) {
    // parse url search string
    const q = new URLSearchParams(location.search).get('q');
    if (q) {
      if (config) {
        try {
          handle(q.trim());
        } catch (error) {
          notify({
            type: 'error',
            message: error.message,
          });
        }
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
}

function handle(userInput) {
  // find a bangSuffix
  let pieces = userInput.split(/\s+/);
  let bangSuffix = '';
  let piecesIndex = -1;
  const bangPrefixPattern = new RegExp(
    `${config.RESERVED_BANG_PREFIX}|${config.bangPrefix}`
  );
  pieces.findIndex(function (item, index) {
    const result = bangPrefixPattern.exec(item);
    if (result && result.index === 0) {
      bangSuffix = item.substr(result[0].length).toLowerCase();
      piecesIndex = index;
      return true;
    }
  });

  // affirm that the bangSuffix is valid
  let rulesIndex = -1;
  let keywords = '';
  config.rules.findIndex(function (item, index) {
    if (item[0] === bangSuffix) {
      // the bangSuffix is valid
      rulesIndex = index;
      pieces.splice(piecesIndex, 1);
      keywords = pieces.join(' ');
      return true;
    }
  });

  // the bangSuffix is invalid
  if (rulesIndex < 0) {
    rulesIndex = config.index;
    keywords = userInput;
  }

  // notify
  notify({
    type: 'success',
    message: 'Redirecting',
  });

  // go
  const newLink = config.rules[rulesIndex][1] + encodeURIComponent(keywords);
  location.replace(newLink);
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
    try {
      handle(qInput.value.trim());
    } catch (error) {
      notify({
        type: 'error',
        message: error.message,
      });
    }
  } else {
    notify({
      type: 'error',
      message: 'Config is Required',
    });
  }
});

window.addEventListener('storage', function (event) {
  if (event.key === 'config') {
    try {
      config = JSON.parse(event.newValue);
    } catch (error) {
      notify({
        type: 'error',
        message: error.message,
      });
      return false;
    }
  } else if (event.key === null) {
    localStorage.setItem('config', JSON.stringify(DEFAULT_SETTINGS, null, 2));
    config = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function (error) {
      notify({
        type: 'error',
        message: error.message,
      });
    });
  });
}

// start
start();
