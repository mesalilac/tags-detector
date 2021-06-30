class Info {
  constructor() {
    this.tags = this.findtags()
  }

  getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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
