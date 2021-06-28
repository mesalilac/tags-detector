document.addEventListener('DOMContentLoaded', () => {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // load saved blacklist
    chrome.storage.sync.get("blacklist",(res) => {
        let blacklist = res.blacklist

        if (blacklist === undefined || blacklist.length == 0) {
            document.getElementById("contener").innerHTML += `
                <div style="display: block;">
                    <input class="new-tag-input" id="input-1" type="text">
                </div>
            `
        } else {
            for (let i = 0; i < blacklist.length; i++) {
                document.getElementById("contener").innerHTML += `
                    <div style="display: block;">
                        <input class="new-tag-input" id="input-${i+1}" type="text" value="${blacklist[i]}">
                    </div>
                `
            }
        }
    })

    // add new input form when add tag button pressed
    function addNewInputForm(count) {
        document.getElementById("contener").innerHTML += `
            <div style="display: block;">
                <input class="new-tag-input" id="input-${count+1}" type="text">
            </div>
        `
    }

    document.getElementById("add-tag").addEventListener("click", () => {
        let contener_child_count = document.getElementById("contener").childElementCount
        let values = []


        for (let j = 1; j <= contener_child_count; j++) {
            var elm = document.getElementById(`input-${j}`)
            if (elm) {
                values.push(elm.value);
            }
        }
    
        addNewInputForm(contener_child_count)
    
        for (let i = 0; i < contener_child_count; i++) {
            document.getElementById(`input-${i+1}`).value = values[i]
        }
    })
    
    document.getElementById("save").addEventListener("click", async () => {
        var blacklist = []
        
        for (let j = 1; j <= document.getElementById("contener").childElementCount; j++) {
            var elm = document.getElementById(`input-${j}`)
            if (elm && elm.value != "") {
                blacklist.push(elm.value);
            }
        }

        document.getElementById("save").textContent = "done!"

        await sleep(670)

        document.getElementById("save").textContent = "save"


        chrome.storage.sync.set({"blacklist": blacklist}, () => {
            console.log("blacklist update");
        })
        
    })

    document.getElementById("reset").addEventListener("click", () => {
        chrome.storage.sync.set({"blacklist": []}, () => {
            console.log("reset settings");
        })

        location.reload()
    })
    
})
