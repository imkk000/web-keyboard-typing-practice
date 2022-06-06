const allowASCII = 'asdfghjklqwertyuiop';

let dicts = [];
let message = '';
let cursorIndex = 0;
let isMistake = false;

const updateCursor = i => {
    $('span.character').eq(i - 1).removeClass('selected');
    $('span.character').eq(i).addClass('selected');
}

const updateVisited = (i, isMistake) => {
    const className = isMistake ? 'incorrect' : 'visited';
    $('span.character').eq(i - 1).addClass(className);
}

const generateNumber = (number) => {
    let spaceCounter = 0;
    let msg = '';
    let ch = '';
    for (let i = 0; i < value; i++) {
        do {
            ch = randomText(allowASCII);
        } while (ch === ' ' && spaceCounter <= 2);

        spaceCounter += ch !== ' ';
        if (spaceCounter >= 7) {
            ch = ' ';
        }
        if (ch === ' ') {
            spaceCounter = 0;
        }
        msg += ch;
    }
    return msg.trim().split(' ');
}

const generateObject = (value) => {
    const wordSize = Math.floor(Math.random() * 50) + 50;
    let words = [];
    for (let i = 0; i < wordSize; i++) {
        index = Math.floor(Math.random() * value.length);
        words.push(value[index]);
    }
    return words;
}

const generateString = (value) => {
    return value.trim().split(' ');
}

const generateWords = (value) => {
    if (typeof value === 'number') {
        return generateNumber(value);
    }
    if (typeof value == 'object') {
        return generateObject(value);
    }
    return generateString(value);
}

const displayWords = (words) => {
    words.forEach((word, index) => {
        const wordElm = $('<div>').addClass('word');
        for (let i = 0; i < word.length; i++) {
            wordElm.append($('<span>').addClass('character').html(word.charAt(i)));
        }
        $('#words').append(wordElm);

        if (index < words.length - 1) {
            const wordElm = $('<div>').addClass('word');
            const whitespaceElm = wordElm.append($('<span>').addClass('character').html('·'));
            $('#words').append(whitespaceElm);
        }
    });
}

const displayStats = () => {
    $('#word-count').text(`${cursorIndex+1}/${message.length}`);
}

const displayDashboard = () => {
    displayStats();
}

const resetWords = async () => {
    if (dicts.length == 0) {
        const regex = new RegExp(`^[${allowASCII}]+$`);
        const getDicts = await $.getJSON('json/words.json');
        // filter words
        dicts = getDicts.filter(word => regex.test(word))
    }

    $('#words').empty();
    message = '';
    cursorIndex = 0;
    isMistake = false;

    const words = generateWords(dicts);
    message = words.join(' ');
    displayWords(words);
    updateCursor(cursorIndex);
    for (let i = 0; i < cursorIndex; i++) {
        updateVisited(i);
    }
    displayDashboard();
}

$(document).ready(() => {
    resetWords();
})

$(document).keydown(event => {
    const key = event.key;
    if (allowASCII.indexOf(key) < 0 && key !== ' ') {
        return;
    }

    if (key !== message[cursorIndex]) {
        isMistake = true;
        displayDashboard();
        return;
    }

    cursorIndex = (cursorIndex + 1) % message.length;
    if (cursorIndex === 0) {
        resetWords();
        return;
    }

    updateCursor(cursorIndex);
    updateVisited(cursorIndex, isMistake);
    displayDashboard();
    isMistake = false;
});
