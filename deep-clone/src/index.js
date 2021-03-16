class DeepCloner {
  cache = [];

  deepClone (source) {
    if (source instanceof Object) {
      let cachedDist = this.findCache(source);
      if (cachedDist) {
        return cachedDist;
      } else {
        let dist
        if (source instanceof Array) {
          dist = new Array();
        } else if (source instanceof Function) {
          dist = function () {
            return source.apply(this, arguments);
          }
        } else if (source instanceof RegExp) {
          dist = new RegExp(source.source, source.flags);
        } else if (source instanceof Date) {
          dist = new Date(source);
        } else {
          dist = new Object();
        }
        this.cache.push([source, dist]);
        for (let key in source) {
          if (source.hasOwnProperty(key)) { // for in 循环会便利原型的属性
            dist[key] = this.deepClone(source[key]);
          }
        }
        return dist;
      }
    }
    return source;
  }

  findCache (source) {
    for (let i = 0; i < this.cache.length; i++) {
      if (this.cache[i][0] === source) {
        return this.cache[i][1];
      }
    }
    return undefined;
  }
}

// let cache = [];

// function deepClone (source) {
//   if (source instanceof Object) {
//     let cachedDist = findCache(source);
//     if (cachedDist) {
//       return cachedDist;
//     } else {
//       let dist
//       if (source instanceof Array) {
//         dist = new Array();
//       } else if (source instanceof Function) {
//         dist = function () {
//           return source.apply(this, arguments);
//         }
//       } else if (source instanceof RegExp) {
//         dist = new RegExp(source.source, source.flags);
//       } else if (source instanceof Date) {
//         dist = new Date(source);
//       } else {
//         dist = new Object();
//       }
//       cache.push([source, dist]);
//       for (let key in source) {
//         if (source.hasOwnProperty(key)) { // for in 循环会便利原型的属性
//           dist[key] = deepClone(source[key]);
//         }
//       }
//       return dist;
//     }
//   }
//   return source;
// };

// function findCache (source) {
//   for (let i = 0; i < cache.length; i++) {
//     if (cache[i][0] === source) {
//       return cache[i][1];
//     }
//   }
//   return undefined;
// }
module.exports = DeepCloner;
