// console.log(jQuery)
// console.log($)


const $siteList = $(".siteList")
const $lastLi = $siteList.find("li.last")
const x = localStorage.getItem("x")
// console.log(x)
const xObject = JSON.parse(x)
// console.log(xObject)
const hashMap = xObject || [
  {logo: "A", logoType: "text", url: "https://www.acfun.cn"},
  {logo: "B", logoType: "image", url: "https://www.bilibili.com"}
]
// 用于优化 link 显示的内容（在渲染html结构时调用）
const simplifyUrl = (url) => {
  // replace 返回新的字符串（所以可以链式调用）
  return url.replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, "")  // 删除 / 开头的内容 （需要转义）
}
const render = () => {
  $siteList.find("li:not(.last)").remove() // 把之前的li都删掉，然后添加新的
  hashMap.forEach((node, index) => { // 遍历 hashMap，把每一项放到 lastLi 之前
    // console.log(node)
    const $li = $(`
         <li>
           <!--<a href="${node.url}">-->
             <div class="site">
               <div class="logo">${node.logo[0]}</div>
               <div class="link">${simplifyUrl(node.url)}</div>
               <div class="close">
                <svg class="icon">
                  <use xlink:href="#icon-close"></use>
                </svg>
               </div>
             </div>
           <!--</a>-->
         </li>
    `).insertBefore($lastLi)  // 把hashMap里的每一项都插入到按钮前
    
    // 需求：点击li中的close关闭按钮，不会（冒泡）触发到跳转
    $li.on("click", ".close", (e) => {
      e.stopPropagation()  // 阻止冒泡
      // console.log(hashMap)
      hashMap.splice(index, 1)
      setDataInLS()
      render()
    })
    // 结果：发现用 a 标签，始终会触发（阻止冒泡无效）。弃用 a 标签，用 js 实现跳转
    $li.on("click", () => {
      window.open(node.url, "_blank")  // '_self'当前窗口打开；'_blank'新窗口打开
    })
  })
}
render()

$(".addButton").on("click", () => {
  // 弹窗
  let url = window.prompt("请输入要添加的网址：")  // 确定，返回输入内容；取消，返回null
  // url不是以http开头，就自动加上
  // string.indexOf('xxx') => 返回xxx所在的首个下标，如果返回的是0说明xxx是字符串开头单词
  if (url && url.indexOf("http") !== 0) {
    url = "https://" + url
  } else {
    return  // 如果 url 为空就结束
  }
  console.log(url)
  
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    // logoType: "text",
    url: url
  })
  setDataInLS()
  render()
})

// onbeforeunload 离开当前页面之前
// (上述监听，可能有失误率)可每次往hashMap添加（push）新的链接时，就顺便存入 LS 中
const setDataInLS = () => {
  const hashMapStr = JSON.stringify(hashMap)  // 对象 变 json字符串
  window.localStorage.setItem("x", hashMapStr)
  // console.log('页面要关闭了')
  // console.log(typeof hashMapStr)  // string
}

window.onbeforeunload = () => {
  setDataInLS()
}

/*
* 键盘事件
* */
// document.addEventListener()
$(document).on("keypress", (e) => {
  // console.log(e.key)
  const {key} = e   // 简写， key = e.key
  console.log(key)
  for (let i = 0; i < hashMap.length; i++) {
    if(hashMap[i].logo.toLowerCase() === key){
      window.open(hashMap[i].url,"_blank")
    }
  }
})
