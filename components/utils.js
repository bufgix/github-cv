const getLangColorsMap = (opacity = "0.5") => {
  const langColorsMap = {
    Python: `rgba(53,114,165, ${opacity})`,
    JavaScript: `rgba(241,224,90, ${opacity})`,
    Java: `rgba(176,114,25, ${opacity})`,
    Vue: `rgba(44,62,80, ${opacity})`,
    Shell: `rgba(137,224,81, ${opacity})`,
    C: `rgba(85,85,85, ${opacity})`,
    "C++": `rgba(243,75,125, ${opacity})`,
    CSS: `rgba(86,61,124, ${opacity})`,
    HTML: `rgba(227,76,38, ${opacity})`,
    Lua: `rgba(0,0,128, ${opacity})`,
    "C#": `rgba(23,134,0, ${opacity})`,
    CoffeeScript: `rgba(36,71,118, ${opacity})`,
    TypeScript: `rgba(43,116,137, ${opacity})`,
    Crystal: `rgba(0,1,0, ${opacity})`,
    Ruby: `rgba(112,21,22, ${opacity})`,
    Assembly: `rgba(110,76,19, ${opacity})`,
    Go: `rgba(0,173,216, ${opacity})`,
    Dart: `rgba(0,180,171, ${opacity})`,
    Kotlin: `rgba(241,142,51, ${opacity})`,
    PHP: `rgba(79,93,149, ${opacity})`
  };

  return langColorsMap;
};

const dynamicSort = property => {
  var sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function(a, b) {
    if (sortOrder == -1) {
      return b[property] - a[property];
    } else {
      return a[property] - b[property];
    }
  };
};

const calculateLangs = (userRepos) => {
  const getByIndex = function(setObj, index) {
    return [...setObj][index];
  };

  let totalRepos = userRepos.length;
  let stats = [];
  let langs = new Set();

  userRepos.forEach(repo => {
    if (!(repo.language === null)) {
      langs.add(repo.language);
    }
  });
  for (var i = 0; i < langs.size; i++) {
    let count = 0;
    for (var j = 0; j < totalRepos; j++) {
      if (getByIndex(langs, i) == userRepos[j].language) {
        count++;
      }
    }
    stats.push({
      name: getByIndex(langs, i),
      count: +count
    });
  }
  stats = stats.map(stat => {
    return {
      ...stat,
      percentage: (stat.count / totalRepos) * 100,
      color: getLangColorsMap()[stat.name],
      borderColor: getLangColorsMap("1")[stat.name]
    };
  });

  /*
  return {
      name,
      count,
      percentage
  }
  */

  return stats;
};
export { getLangColorsMap, dynamicSort, calculateLangs };
