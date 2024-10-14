let companiesData = [];
let idx = 0;
let dragState = false;
let startPoint = 0;
let movePoint = 0;
let currentBox = document.getElementById('boxElement');
let emptyMessage = document.getElementById('emptyBoxMessage');
let detailsButton = document.getElementById('detailsBtn');
const swipeLimit = 120;
const maxTilt = 45;

async function fetchCompanies() {
    try {
        const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:xFXNH7S-/zlecenia_nieprzypisane'); // Zmień URL na swój właściwy endpoint
        if (!response.ok) {
            throw new Error('Błąd sieciowy podczas pobierania danych');
        }
        const companies = await response.json();
        console.log('Pobrane dane:', companies);
        return companies;
    } catch (error) {
        console.error('Błąd podczas pobierania danych z Xano:', error);
        return [];
    }
}

async function fetchInvestor(investorId) {
    try {
        const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:xFXNH7S-/user_info/${investorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Błąd sieciowy podczas pobierania danych inwestora');
        }

        const investor = await response.json();
        console.log('Pobrane dane inwestora:', investor);
        return investor;
    } catch (error) {
        console.error('Błąd podczas pobierania danych inwestora:', error);
        return null;
    }
}

async function showItem() {
    if (idx >= companiesData.length) {
        currentBox.style.display = 'none';
        emptyMessage.style.display = 'block';
        detailsButton.style.display = 'none';
        return;
    }

    const item = companiesData[idx];
    document.getElementById('boxName').innerText = item.title;
    document.getElementById('boxAddress').innerText = item.location;
    document.getElementById('boxPhone').innerText = item.phoneNumber;

    document.getElementById('investorInfo').innerText = 'Investor Information not available';

    if (item.investor_id) {
        const investor = await fetchInvestor(item.investor_id);
        if (investor) {
            document.getElementById('investorInfo').innerText = `Inwestor: ${investor.full_name}, Email: ${investor.email}`;
            document.getElementById('boxName').innerText = investor.full_name;
        }
    }

    currentBox.style.transform = 'translate(0px, 0px) rotate(0deg)';
    currentBox.style.opacity = '1';
}
function dragStart(e) {
    dragState = true;
    startPoint = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    currentBox.style.transition = 'none';
    currentBox.style.cursor = 'grabbing';
}

function drag(e) {
    if (!dragState) return;
    movePoint = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const offset = movePoint - startPoint;
    const angle = (offset / window.innerWidth) * maxTilt;
    currentBox.style.transform = `translateX(${offset}px) rotate(${angle}deg)`;

    const maxOffset = window.innerWidth / 2;
    const colorFactor = Math.min(Math.abs(offset) / maxOffset, 1);

    if (Math.abs(offset) < 10) {
        currentBox.style.backgroundColor = 'white';
    } else if (offset > 0) {
        const redPart = Math.floor(255 * (1 - colorFactor));
        currentBox.style.backgroundColor = `rgb(${redPart}, 255, ${redPart})`;
    } else {
        const greenPart = Math.floor(255 * (1 - colorFactor));
        currentBox.style.backgroundColor = `rgb(255, ${greenPart}, ${greenPart})`;
    }
}

function dragEnd() {
    if (!dragState) return;
    dragState = false;
    const offset = movePoint - startPoint;
    currentBox.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    currentBox.style.cursor = 'grab';

    if (offset > swipeLimit) {
        currentBox.style.transform = 'translateX(500px) rotate(45deg)';
        currentBox.style.opacity = '0';
        idx++;
        setTimeout(showItem, 500);
    } else if (offset < -swipeLimit) {
        currentBox.style.transform = 'translateX(-500px) rotate(-45deg)';
        currentBox.style.opacity = '0';
        idx++;
        setTimeout(showItem, 500);
    } else {
        currentBox.style.transform = 'translateX(0) rotate(0)';
    }

    currentBox.style.backgroundColor = 'white';
}

currentBox.addEventListener('mousedown', dragStart);
currentBox.addEventListener('mousemove', drag);
currentBox.addEventListener('mouseup', dragEnd);
currentBox.addEventListener('mouseleave', dragEnd);

currentBox.addEventListener('touchstart', dragStart);
currentBox.addEventListener('touchmove', drag);
currentBox.addEventListener('touchend', dragEnd);

window.onload = showItem;

function randomFunc() {
    if (idx >= companiesData.length) return;

    let currentItem = companiesData[idx];
    let currentName = currentItem.title;
    let currentAddress = currentItem.location;

    alert(`Zlecenie: ${currentName}\nLokalizacja: ${currentAddress}`);
}
