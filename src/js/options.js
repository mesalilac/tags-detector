function GEN_TEMPLATE(count) {
    return `
        <div style="display: block;">
            <input class="new-tag-input" id="input-${count+1}" type="text">
        </div>
    ` 
}

document.getElementById("add-tag").addEventListener("click", e => {
    let contener_child_count = document.getElementById("contener").childElementCount
    var values = []

    for (let i = 1; i <= contener_child_count; i++) {
        var elm = document.getElementById(`input-${i}`)
        if (elm) {
            values.push(elm.value);
        }
    }

    document.getElementById("contener").innerHTML += GEN_TEMPLATE(contener_child_count)

    for (let i = 0; i < contener_child_count; i++) {
        document.getElementById(`input-${i+1}`).value = values[i]
    }
})

document.getElementById("save").addEventListener("click", e => {})
