if (typeof(Storage) === "undefined") {
    console.error("Storage class not found.")
    alert("Local storage not supported. Try another web browser.")
}
else {
    localStorage.setItem("1970-01-01T00:00", '["Initialized"]')
}

function populateMeds() {
    let doseInput = document.getElementById('dose-input')
    meds.forEach(entry => {
        let compactEntry = entry.replace(/ /g, '')
        doseInput.innerHTML += `<input id="${compactEntry}" name="${entry}" type="checkbox"><label for="${compactEntry}">${entry}</label><br>`
    })
}

function showDoses() {
    keys = []
    for (let i=0; i<localStorage.length; i++) {
        keys.push(localStorage.key(i))
    }
    keys.sort().reverse()  // ISO date strings are designed to sort lexicographically.

    doseHistoryElement = document.getElementById('dose-history')
    doseHistoryElement.innerHTML = ""
    for (let i=0; i<keys.length; i++) {
        key = keys[i]
        value = JSON.parse(localStorage.getItem(key))
        let datetime = new Date(key).toLocaleString()
        let output = ""
        if (i%2) {
            output += "<tr>"
        }
        else {
            output += "<tr class='bar-paper'>"
        }
        output += `<td>${datetime}</td>`
        output += `<td>${value.toString().replace(/,/g, ', ')}</td>`
        output += "</tr>"
        doseHistoryElement.innerHTML += `${output}\n`
    }
}

function saveDose() {
    let datetime = document.getElementById('datestamp').value + 'T' + document.getElementById('timestamp').value
    if ((new Date(datetime) === "Invalid Date") || isNaN(new Date(datetime))) {
        console.error("Bad date format:", datetime)
    }
    else {
        console.debug("DateTime:", datetime)
        meds = []
        let medList = document.getElementById('dose-input').children
        for (let i = 0; i < medList.length; i++) {
            if (medList[i].hasAttribute('type') && medList[i].getAttribute('type') === 'checkbox') {
                if (medList[i].checked) {
                    meds.push(medList[i].name)
                    console.debug(datetime, medList[i].name)
                }
            }
        }

        let existingData = localStorage.getItem(datetime)
        if (existingData) {
            console.debug("Cowardly refusing to overwrite existing data:", existingData)
            alert("Sorry, an entry already exists for the same date/time.")
        }
        else {
            localStorage.setItem(datetime, JSON.stringify(meds))
            console.debug(localStorage.getItem(datetime))
            showDoses()
        }
    }
}

function exportJSON() {
    let serializedStorage = JSON.stringify(localStorage, null, 2)
    let fileBlob = new Blob([serializedStorage], { type: "text/plain" })
    let blobURL =  URL.createObjectURL(fileBlob)
    window.open(blobURL)
}

function exportCSV() {
    let serializedStorage = ""
    keys = []
    for (let i=0; i<localStorage.length; i++) {
        keys.push(localStorage.key(i))
    }
    keys.sort().reverse()

    for (let i=0; i<keys.length; i++) {
        let key = keys[i]
        let value = JSON.parse(localStorage.getItem(key)).join(', ')
        let datetime = new Date(key).toLocaleString()
        serializedStorage += `${datetime}, ${value}\n`
    }

    let fileBlob = new Blob([serializedStorage], { type: "text/plain" })
    let blobURL =  URL.createObjectURL(fileBlob)
    window.open(blobURL)
}