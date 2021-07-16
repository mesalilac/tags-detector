chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === 'reload') {
      location.reload()
    }
})

class Info {
  constructor() {
    this.tags = this.findtags()
  }

  getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  gotoBottom(selector){
    var element = document.querySelector(selector)
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }

  findtags() {
    let hostname = location.hostname

    // nhentai
    if (hostname == "nhentai.net") {
      var tags_list = document.querySelector("#tags > div:nth-child(3) > span") 
      if (tags_list) {
        let list = [] 
        for (let i = 0; i < tags_list.childElementCount; i++) {
          var tag = tags_list.children[i].firstChild.textContent.toLowerCase()
          list.push(tag)
        }
        return list
      }
    }
    
    if (hostname == "hentaidude.com") {
      var tags_list = this.getElementByXpath('//*[@id="aboutid"]/div/div[3]')
      var list = []

      if (tags_list) {
        for (let i = 0; i < tags_list.childElementCount; i++) {
          let tag_selector = document.querySelector(`#aboutid > div > div:nth-child(3) > a:nth-child(${i - 1})`)
          if (tag_selector) {
            var tag = tag_selector.textContent.toLowerCase()
            list.push(tag)
          }
        }
        return list
      }
    }
    
    if (hostname == "hanime.tv" || hostname == "members.hanime.tv") {
      var tags_list = document.getElementsByClassName("hvpis-text")[0]
      var list = []

      if (tags_list) {
        for (let i = 1; i <= tags_list.childElementCount; i++) {
          let tag_selector = document.querySelector(`.hvpis-text.grey--text.text--lighten-1 > a:nth-child(${i})`)
          if (tag_selector) {
            var tag = tag_selector.textContent.toLowerCase()

            list.push(tag)
          }
        }
        return list
      }
    }

    if (hostname == "hentai.tv") {
      var tags_list = document.querySelector("#aa-wp > div.bd > div > div > main > article > footer > p").getElementsByTagName("a")
      var list = []
      
      for (let i = 0; i < tags_list.length; i++) {
        var tag = tags_list[i].textContent.toLowerCase()
        
        list.push(tag)
      }
      return list
    }
  }
}

var get = new Info()

function check_tags() {
  var detected_tags = []

  chrome.storage.sync.get("blacklist",(res) => {
    let blacklist = res.blacklist
    if (get.tags) {
      for (let i = 0; i < get.tags.length; i++) {
        if (blacklist.includes(get.tags[i])) {
          detected_tags.push(get.tags[i])
        }
      } 

      if (detected_tags.length >= 1) {
        detected_tags = detected_tags.join(" and ")
        alert(`warning blacklisted tags detected: ${detected_tags}!`)
      }
    }
  })
}

check_tags()
