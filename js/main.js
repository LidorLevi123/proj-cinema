'use strict'

var gCinema
var gElSelectedSeat = null

function onInit() {
    gCinema = createCinema()
    renderCinema()
}

function createCinema() {
    const cinema = []

    for (var i = 0; i < 7; i++) {
        cinema[i] = []
        for (var j = 0; j < 16; j++) {
            const cell = { isSeat: (j !==0 && j !== 3 && j !== 13 && i !== 3), isInfoCol: (j === 0 && i !== 3)}
            if (cell.isSeat) {
                cell.price = 5 + i
                cell.isBooked = false
            }
            if (cell.isInfoCol) {
                cell.row = i+1
            }
            cinema[i][j] = cell
        }
    }
    return cinema
}

function renderCinema() {
    var strHTML = ''
    
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]

            // For a cell of type SEAT add seat class
            var className = (cell.isSeat) ? 'seat' : ''
            var data = (cell.isSeat) ? j : ''
            // For a cell that is booked add booked class
            if (cell.isBooked) className += ' booked'
            if (cell.isInfoCol) data = i+1
            // Add a seat title
            const title = `Seat: ${i + 1}, ${j}`

            strHTML += `\t<td data-i="${i}" data-j="${j}" title="${title}" class="cell ${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})">${data}
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    const elSeats = document.querySelector('.cinema-seats')
    elSeats.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    const cell = gCinema[i][j]

    // ignore none seats and booked seats
    if (!cell.isSeat || cell.isBooked) return

    // console.log('Cell clicked: ', elCell, i, j)

    // Selecting a seat
    elCell.classList.add('selected')
    
    // Only a single seat should be selected
    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }
    gElSelectedSeat = (gElSelectedSeat !== elCell) ? elCell : null

    // When seat is selected a popup is shown
    if (gElSelectedSeat) {
        showSeatDetails({ i, j })
    } else {
        hideSeatDetails()
    }
}

function showSeatDetails(pos) {
    const elPopup = document.querySelector('.popup')
    const elBtn = elPopup.querySelector('.btn-book-seat')

    const seat = gCinema[pos.i][pos.j]

    elPopup.querySelector('h2 span').innerText = `${pos.i + 1}-${pos.j}`
    elPopup.querySelector('h3 span').innerText = `${seat.price}`
    elPopup.querySelector('h4 span').innerText = countAvailableSeatsAround(gCinema, pos.i, pos.j)
    
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false
}

function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function onBookSeat(elBtn) {
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j

    gCinema[i][j].isBooked = true
    renderCinema()

    hideSeatDetails()
}

function countAvailableSeatsAround(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isSeat && !currCell.isBooked) count++
        }
    }
    return count
}


function highlightNearbySeats() {

    var rowIdx = +gElSelectedSeat.dataset.i
    var colIdx = +gElSelectedSeat.dataset.j

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gCinema.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gCinema[0].length) continue

            var currCell = gCinema[i][j]
            var currElSeat = getElementByCoords({i, j})

            if (currCell.isSeat && !currCell.isBooked) {
                currElSeat.classList.add('marked')
            }
        }
    }
    removeSeatsHighlight(2500)
}

function getElementByCoords(coords) {
    const i = coords.i
    const j = coords.j
    return document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
}

function removeSeatsHighlight(timeout) {
    setTimeout(() => {
        var elMarkedSeats = document.querySelectorAll('.marked')
        elMarkedSeats.forEach(seat => {
            seat.classList.remove('marked')
        })
    }, timeout)
}
