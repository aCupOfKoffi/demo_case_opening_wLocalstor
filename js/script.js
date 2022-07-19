window.addEventListener('DOMContentLoaded', function() {

let rollBtn = document.querySelector('.roll_button'),
    roulette = document.querySelector('.roulette'),
    container = document.querySelector('.container'),
    previousArr = document.querySelector('.drop_history'),
    historyElems = document.getElementsByClassName('drop_history_element'),
    rollBlock = document.querySelector('.roll__block');
    takeOrSellBlock = document.querySelector('.take_sell__block'),
    currentDrop = document.querySelector('.curr_drop'),
    sellButton = document.querySelector('.sell_button'),
    takeButton = document.querySelector('.take_button'),
    balanceBlock = document.querySelector('.balance');


    const amountOfCells = 30,
    rollTime  = 5,
    casePrice = 10,
    dropPrices = {
        '#0068FF': 2,
        '#C100FF': 7,
        '#FF4AD6': 15,
        '#FF4A4A': 56,
        '#FCFF4A': 690
    };

    let prevColor,
    historyArrLength = 10,
    currHistoryArr = [],
    inventory = [],
    firstRoll = true,
    bankrupt = false,
    balance;
    balanceCheck();
    if (!localStorage.getItem('balance')) {
        balance = localStorage.setItem('balance', 100);
    }
    balance = localStorage.getItem('balance');
    balanceBlock.textContent = balance;

    // fill with probs

    function fillRoulette() {

        for (let i = 0; i < amountOfCells; i++) {
            let cell = document.createElement('div');
            let randQ = Math.random() * 100;
            // console.log(randQ);
            cell.classList.add('rollElement');
            // cell.innerHTML = i;
            cell.style.transform = `translateX(${150 * i}px)`;
            roulette.append(cell);
            if (randQ > 20) {
                cell.style.border = '2px solid #0068FF';
                if (i === 27) prevColor = '#0068FF';
                continue;
            }
            if (randQ > 10) {
                cell.style.border = '2px solid #C100FF';
                if (i === 27) prevColor = '#C100FF';
                continue;
            }
            if (randQ > 5) {
                cell.style.border = '2px solid #FF4AD6';
                if (i === 27) prevColor = '#FF4AD6';
                continue;
            }
            if (randQ > 1) {
                cell.style.border = '2px solid #FF4A4A';
                if (i === 27) prevColor = '#FF4A4A';
                continue;
            }
            if (i === 27){
                cell.style.border = '2px solid #FCFF4A';
                prevColor = '#FCFF4A';
            } else {
                cell.style.border = '2px solid #FF4A4A';
                if (i === 27) prevColor = '#FF4A4A';
            }

        }
    }

    // append element in history

    function appendHistoryElem(color) {
        previousArr.innerHTML = '';
        currHistoryArr.unshift(color);
        if (currHistoryArr.length > historyArrLength) currHistoryArr.pop();
        currHistoryArr.forEach(item => {
            let element = document.createElement('div');
            element.classList.add('drop_history_element');
            element.style.border = `2px solid ${item}`;
            // element.style.boxShadow = `inset 0 0 10px ${item}`;
            previousArr.append(element);
        })
    }

    // roll

    function rollRoulette() {
        if (firstRoll) {
            fillRoulette();
            firstRoll = false;
        }
        let randOffset = Math.random() * 150;
        roulette.style.animation = `rollAnim ${rollTime}s ease-out`;
        rollBtn.style.display = 'none';
        // setTimeout(500);
    }

    // clear

    function clearRoulette() {
        roulette.style.animation = '';
        rollBtn.style.display = 'block';
        roulette.innerHTML = '';
        roulette.style.transform = `translateX(0px)`;
    }

    function takeOrSell(color) {
        sellButton.textContent = `Продать за ${dropPrices[color]}`
        rollBlock.style.display = 'none';
        takeOrSellBlock.style.display = 'flex';
        currentDrop.style.border = `2px solid ${color}`;
        sellButton.onclick = () => {
            balance = balance + dropPrices[color];
            console.log(dropPrices);
            localStorage.setItem('balance', balance);
            balanceBlock.textContent = balance;
            renewRoulette();
            fillRoulette();
        }
        takeButton.onclick = () => {
            inventory.push(color);
            renewRoulette();
            fillRoulette();
        }
    }

    function renewRoulette() {
        rollBlock.style.display = 'flex';
        takeOrSellBlock.style.display = 'none';
    }

    function balanceCheck() {
        if (localStorage.getItem('balance') < 0){
            balance = 0;
            localStorage.setItem('balance', balance);
        }
        if (balance < casePrice) {
            rollBtn.style.backgroundColor = '#b41c2e';
            rollBtn.style.display = 'none';
            console.log('банкрот');
            return;
        }
    }

    takeOrSellBlock.style.display = 'none';



    rollBtn.addEventListener('click', () => {

        balance -= casePrice;
        balanceBlock.textContent = balance;
        localStorage.setItem('balance', balance);
        rollRoulette();
        setTimeout(() => {
            clearRoulette();
            appendHistoryElem(prevColor);
            takeOrSell(prevColor);
            balanceCheck();
        }, rollTime * 1000);
    })



});
