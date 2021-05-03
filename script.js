function reset() {
    const inputs = document.getElementsByTagName('input');
    for (let i of inputs) {
        if (!i.classList.contains('no-reset')) {
            if (i.type == "checkbox") {
                i.checked = false;
            } else {
                i.value = '';
            }
        }
    }
    document.getElementById('portrait0').checked = true;
    document.getElementById('result').hidden = true;
}

function setTimeNow() {
    const now = new Date();
    //ローカル時刻に変換
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    //分刻みに丸める
    const time = now.toISOString().slice(0, -8);
    document.getElementById('initial-time').value = time;
    localStorage.setItem('initial-time', time);
}

function save(e) {
    const t = e.target;
    if (t.type == "checkbox") {
        localStorage.setItem(t.id, t.checked);
    } else {
        localStorage.setItem(t.id, t.value);
    }
}

function restore() {
    const inputs = document.getElementsByTagName('input');
    for (let i of inputs) {
        item = localStorage.getItem(i.id);
        if (item) {
            if (i.type == "checkbox") {
                i.checked = (item == 'true');
            } else {
                i.value = item;
            }
        }
    }
}

function calc() {
    const initialTime = new Date(document.getElementById('initial-time').value);
    const initialSaintQuartz = Number(document.getElementById('initial-saint-quartz').value);
    const initialAp = Number(document.getElementById('initial-ap').value);
    const maxAp = Number(document.getElementById('max-ap').value);
    const questAp = Number(document.getElementById('quest-ap').value);
    const questLv = Number(document.getElementById('quest-lv').value);
    const initialBond = Number(document.getElementById('initial-bond').value);
    const bondBonus = Number(document.getElementById('bond-bonus').value);
    const portrait = Number(document.getElementById('form').portrait.value) * 50;
    const lap = Number(document.getElementById('lap').value);

    const questBondBase = questLv * 10 + 15;
    const questBond = Math.floor(questBondBase * (1 + bondBonus / 100)) + portrait;
    const questBondBonus = questBond - questBondBase;
    const finalBond = initialBond + questBond * lap;

    const consumedAp = questAp * lap;
    const recoveredAp = Math.floor((Date.now() - initialTime) / 1000 / 60 / 5);
    const paidAp = consumedAp - initialAp - recoveredAp;
    const consumedSaintQuartz = Math.ceil(paidAp / maxAp);
    const finalAp = (maxAp - paidAp % maxAp) % maxAp;
    const finalSaintQuartz = initialSaintQuartz - consumedSaintQuartz;

    document.getElementById('quest-bond-base').innerHTML = questBondBase;
    document.getElementById('quest-bond-bonus').innerHTML = questBondBonus;
    document.getElementById('final-bond').innerHTML = finalBond;
    document.getElementById('final-saint-quartz').innerHTML = finalSaintQuartz;
    document.getElementById('final-ap').innerHTML = finalAp;
}


window.addEventListener('load', restore);

const lt = document.getElementById('lt');
lt.addEventListener('change', () => {
    const bondBonus = document.getElementById('bond-bonus');
    if (!bondBonus.value) {
        bondBonus.value = "0";
    }
    if (lt.checked) {
        bondBonus.stepUp(2);
    } else {
        bondBonus.stepDown(2);
    }
    localStorage.setItem('bond-bonus', bondBonus.value);
});
const tt = document.getElementById('tt');
tt.addEventListener('change', () => {
    const bondBonus = document.getElementById('bond-bonus');
    if (!bondBonus.value) {
        bondBonus.value = "0";
    }
    if (tt.checked) {
        bondBonus.stepUp(3);
    } else {
        bondBonus.stepDown(3);
    }
    localStorage.setItem('bond-bonus', bondBonus.value);
});

document.getElementById('set-time-now').addEventListener('click', setTimeNow);
document.getElementById('add').addEventListener('click', () => {
    document.getElementById('input-add').hidden = false;
    document.getElementById('add').disabled = true;
});
document.getElementById('confirm-add').addEventListener('click', () => {
    const addedSaintQuartz = document.getElementById('added-saint-quartz');
    const initialSaintQuartz = document.getElementById('initial-saint-quartz');
    initialSaintQuartz.stepUp(addedSaintQuartz.value);
    localStorage.setItem('initial-saint-quartz', initialSaintQuartz.value);
    addedSaintQuartz.value = '';
    document.getElementById('input-add').hidden = true;
    document.getElementById('add').disabled = false;
});
document.getElementById('cancel-add').addEventListener('click', () => {
    document.getElementById('added-saint-quartz').value = '';
    document.getElementById('input-add').hidden = true;
    document.getElementById('add').disabled = false;
});
document.getElementById('calc').addEventListener('click', () => {
    calc();
    document.getElementById('result').hidden = false;
});
document.getElementById('reset').addEventListener('click', reset);

let inputs = document.getElementsByTagName('input');
for (let i of inputs) {
    i.addEventListener('change', save);
    if (i.parentElement.getElementsByClassName('help').length > 0) {
        i.addEventListener('focusin', (e) => {
            e.target.parentElement.getElementsByClassName('help')[0].style.display = 'block';
        });
        i.addEventListener('focusout', (e) => {
            e.target.parentElement.getElementsByClassName('help')[0].style.display = 'none';
        });
    }
}

setInterval(calc, 5 * 60 * 1000);
