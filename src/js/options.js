const RECOMMENDED_CONFIG = {
  rules: [
    ['b', 'https://www.baidu.com/s?ie=utf-8&wd=', true],
    ['baike', 'https://baike.baidu.com/search?word='],
    ['bi', 'https://www.bing.com/search?q=', true],
    ['bili', 'https://search.bilibili.com/all?keyword='],
    [
      'c',
      'https://dictionary.cambridge.org/search/direct/?datasetsearch=english-chinese-simplified&q=',
    ],
    ['cps', 'https://www.cpsenglish.com/search?word='],
    ['d', 'https://duckduckgo.com/?q=', true],
    ['douban', 'https://www.douban.com/search?q='],
    ['g', 'https://www.google.com/search?q=', true],
    ['github', 'https://github.com/search?q='],
    ['gog', 'https://www.gog.com/games?query='],
    ['jiki', 'https://jikipedia.com/search?phrase='],
    ['l', 'https://www.ldoceonline.com/search/english/direct/?q='],
    ['mdn', 'https://developer.mozilla.org/en-US/search?q='],
    ['mi', 'https://www.mi.com/search?keyword='],
    ['moe', 'https://zh.moegirl.org.cn/index.php?search='],
    ['msdn', 'https://docs.microsoft.com/en-us/search/?terms='],
    ['n', 'https://www.nintendo.com/games/game-guide/#filter/:q='],
    ['o', 'https://www.oxfordlearnersdictionaries.com/search/english/?q='],
    ['php', 'https://www.php.net/manual-lookup.php?pattern='],
    ['steam', 'https://store.steampowered.com/search/?term='],
    ['t/en', 'https://translate.google.com/?sl=auto&tl=en&text='],
    ['t/zh', 'https://translate.google.com/?sl=auto&tl=zh-CN&text='],
    ['tieba', 'https://tieba.baidu.com/f/search/res?ie=utf-8&qw='],
    ['wiki', 'https://en.wikipedia.org/w/index.php?title='],
    ['y', 'https://yandex.com/search/?text='],
    ['z', 'https://www.zdic.net/search/?sclb=tm&q='],
    ['zhihu', 'https://www.zhihu.com/search?q='],
  ],
  index: 0,
};

const configForm = document.querySelector('#config');
const rulesInput = document.querySelector('#rules');
const indexSelect = document.querySelector('#index');
let needSave = false;

function writeSelectOption(rules) {
  // strcat html
  let output = '';
  rules.forEach(function (item, index) {
    const target = new URL(item[1]);
    output += `<option value="${index}">${
      target.origin + target.pathname
    }</option>`;
  });
  indexSelect.innerHTML = output;
}

rulesInput.addEventListener('change', function () {
  try {
    // check rules
    const rules = JSON.parse(rulesInput.value);
    if (!Array.isArray(rules)) {
      notify({
        type: 'error',
        message: 'Invalid Rules',
      });
      return false;
    }
    writeSelectOption(rules);
    indexSelect.value = '';
  } catch (error) {
    writeSelectOption([]);
    indexSelect.value = '';
    notify({
      type: 'error',
      message: 'Error Rules',
    });
    return false;
  }
});

configForm.addEventListener('change', function () {
  needSave = true;
});

configForm.addEventListener('submit', function (event) {
  event.preventDefault();

  let savedConfig = {
    rules: [],
    index: 0,
  };

  if (rulesInput.value) {
    // check rules syntax
    try {
      const rules = JSON.parse(rulesInput.value);
      if (!Array.isArray(rules)) {
        notify({
          type: 'error',
          message: 'Invalid Rules',
        });
        return false;
      }
      rulesInput.value = JSON.stringify(rules, null, 2);
    } catch (error) {
      notify({
        type: 'error',
        message: 'Error Rules',
      });
      return false;
    }
    // pass check
    savedConfig.rules = JSON.parse(rulesInput.value);
  }

  if (indexSelect.value) {
    // check index
    try {
      const index = Number.parseInt(indexSelect.value, 10);
      if (index < 0) {
        notify({
          type: 'error',
          message: 'Invalid Index',
        });
        return false;
      }
      if (index > savedConfig.rules.length - 1) {
        notify({
          type: 'error',
          message: 'Invalid Index',
        });
        return false;
      }
      indexSelect.value = index;
    } catch (error) {
      notify({
        type: 'error',
        message: 'Error Rules',
      });
      return false;
    }
    // pass check
    savedConfig.index = Number.parseInt(indexSelect.value, 10);
  }

  // save options
  localStorage.setItem('config', JSON.stringify(savedConfig));
  notify({
    type: 'success',
    message: 'Saved',
  });
  needSave = false;
});

document.querySelector('#get-advice').addEventListener('click', function () {
  needSave = true;
  rulesInput.value = JSON.stringify(RECOMMENDED_CONFIG.rules, null, 2);
  writeSelectOption(RECOMMENDED_CONFIG.rules);
  indexSelect.value = RECOMMENDED_CONFIG.index;
});

window.addEventListener('beforeunload', function (event) {
  if (needSave) {
    event.preventDefault();
    event.returnValue = '';
  }
});

// start
const configText = localStorage.getItem('config');
if (configText) {
  const config = JSON.parse(configText);
  rulesInput.value = JSON.stringify(config.rules, null, 2);
  writeSelectOption(config.rules);
  indexSelect.value = config.index;
}
