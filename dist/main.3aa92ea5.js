// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
// console.log(jQuery)
// console.log($)
var $siteList = $(".siteList");
var $lastLi = $siteList.find("li.last");
var x = localStorage.getItem("x"); // console.log(x)

var xObject = JSON.parse(x); // console.log(xObject)

var hashMap = xObject || [{
  logo: "A",
  logoType: "text",
  url: "https://www.acfun.cn"
}, {
  logo: "B",
  logoType: "image",
  url: "https://www.bilibili.com"
}]; // 用于优化 link 显示的内容（在渲染html结构时调用）

var simplifyUrl = function simplifyUrl(url) {
  // replace 返回新的字符串（所以可以链式调用）
  return url.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/.*/, ""); // 删除 / 开头的内容 （需要转义）
};

var render = function render() {
  $siteList.find("li:not(.last)").remove(); // 把之前的li都删掉，然后添加新的

  hashMap.forEach(function (node, index) {
    // 遍历 hashMap，把每一项放到 lastLi 之前
    // console.log(node)
    var $li = $("\n         <li>\n           <!--<a href=\"".concat(node.url, "\">-->\n             <div class=\"site\">\n               <div class=\"logo\">").concat(node.logo[0], "</div>\n               <div class=\"link\">").concat(simplifyUrl(node.url), "</div>\n               <div class=\"close\">\n                <svg class=\"icon\">\n                  <use xlink:href=\"#icon-close\"></use>\n                </svg>\n               </div>\n             </div>\n           <!--</a>-->\n         </li>\n    ")).insertBefore($lastLi); // 把hashMap里的每一项都插入到按钮前
    // 需求：点击li中的close关闭按钮，不会（冒泡）触发到跳转

    $li.on("click", ".close", function (e) {
      e.stopPropagation(); // 阻止冒泡
      // console.log(hashMap)

      hashMap.splice(index, 1);
      setDataInLS();
      render();
    }); // 结果：发现用 a 标签，始终会触发（阻止冒泡无效）。弃用 a 标签，用 js 实现跳转

    $li.on("click", function () {
      window.open(node.url, "_blank"); // '_self'当前窗口打开；'_blank'新窗口打开
    });
  });
};

render();
$(".addButton").on("click", function () {
  // 弹窗
  var url = window.prompt("请输入要添加的网址："); // 确定，返回输入内容；取消，返回null
  // url不是以http开头，就自动加上
  // string.indexOf('xxx') => 返回xxx所在的首个下标，如果返回的是0说明xxx是字符串开头单词

  if (url && url.indexOf("http") !== 0) {
    url = "https://" + url;
  } else {
    return; // 如果 url 为空就结束
  }

  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    // logoType: "text",
    url: url
  });
  setDataInLS();
  render();
}); // onbeforeunload 离开当前页面之前
// (上述监听，可能有失误率)可每次往hashMap添加（push）新的链接时，就顺便存入 LS 中

var setDataInLS = function setDataInLS() {
  var hashMapStr = JSON.stringify(hashMap); // 对象 变 json字符串

  window.localStorage.setItem("x", hashMapStr); // console.log('页面要关闭了')
  // console.log(typeof hashMapStr)  // string
};

window.onbeforeunload = function () {
  setDataInLS();
};
/*
* 键盘事件
* */
// document.addEventListener()


$(document).on("keypress", function (e) {
  // console.log(e.key)
  var key = e.key; // 简写， key = e.key

  console.log(key);

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url, "_blank");
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.3aa92ea5.js.map