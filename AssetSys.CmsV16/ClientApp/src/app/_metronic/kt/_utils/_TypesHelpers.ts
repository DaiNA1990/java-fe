function getObjectPropertyValueByKey(obj: any, key: string): any | undefined {
  const map = new Map(Object.entries(obj))
  if (obj.hasOwnProperty(key) && map) {
    return map.get(key)
  }
}

/**
 * Generates unique ID for give prefix.
 * @param {string} prefix Prefix for generated ID
 * @returns {boolean}
 */
// function getUniqueIdWithPrefix(prefix: string | undefined): string {
//   const result = Math.floor(Math.random() * new Date().getTime()).toString()
//   if (!prefix) {
//     return result
//   }

//   return `${prefix}${result}`
// }
//thay ham trên fix lỗi quét sorna 2025-09-11
function getUniqueIdWithPrefix(prefix?: string): string {
  // Tạo random number an toàn bằng crypto
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  const result = array[0].toString(36); // đổi sang base36 cho ngắn gọn

  return prefix ? `${prefix}${result}` : result;
}


/* eslint-disable no-useless-escape */
function stringSnakeToCamel(str: string): string {
  return str.replace(/(\-\w)/g, function (m) {
    return m[1].toUpperCase()
  })
}

function toJSON(value: string | JSON): JSON | undefined {
  if (typeof value !== 'string') {
    return value
  }

  if (!value) {
    return undefined
  }

  // ("'" => "\"");
  const result = value
    .toString()
    .split('')
    .map((el) => (el !== "'" ? el : '"'))
    .join('')
  //2025-09-11 comment và thay fix issue sercurity
  // var jsonStr = result.replace(/(\w+:)|(\w+ :)/g, function (matched) {
  //   return '"' + matched.substring(0, matched.length - 1) + '":'
  // })
  var jsonStr = result.replace(/([A-Za-z0-9_]{1,50})\s*:/g, function (matched) {
  return '"' + matched.substring(0, matched.length - 1) + '":';
  });
  try {
    return JSON.parse(jsonStr)
  } catch {
    return undefined
  }
}

export {getObjectPropertyValueByKey, getUniqueIdWithPrefix, stringSnakeToCamel, toJSON}
