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
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id') || 'defaultId';  // Get user_id or default value

console.log('User ID:', userId);

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
            document.getElementById('boxAddress').innerText = investor.email;
            document.getElementById('boxPhone').innerText = investor.phone_number;
        }
    }

    currentBox.style.transform = 'translate(0px, 0px) rotate(0deg)';
    currentBox.style.opacity = '1';
}


async function assignFreelancerToJob(zlecenieId, freelancerId) {
    try {
        const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:xFXNH7S-/zlecenia_add_frelancer_id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_zlecenia: zlecenieId,
                id_freelancera: freelancerId
            })
        });

        if (!response.ok) {
            throw new Error('Błąd sieciowy podczas przypisywania zlecenia');
        }

        const result = await response.json();
        console.log('Zlecenie przypisane:', result);
    } catch (error) {
        console.error('Błąd podczas przypisywania zlecenia:', error);
    }
}

async function showPopup() {
    if (idx >= companiesData.length) return;

    let currentItem = companiesData[idx];
    let investorName = 'Brak inwestora'; // Domyślny tekst
    let investorDescription = currentItem.description; // Domyślny opis

    // Sprawdzenie, czy jest dostępny identyfikator inwestora
    if (currentItem.investor_id) {
        const investor = await fetchInvestor(currentItem.investor_id);
        if (investor) {
            investorName = investor.full_name;
           
        }
    }

    document.getElementById('popupTitle').innerText = investorName;
    document.getElementById('popupDescription').innerText = investorDescription;
    document.getElementById('popup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Funkcje drag and drop
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
        const currentItem = companiesData[idx];
        const freelancerId = 32;  // Zastąp tym, jak pobierasz ID freelancera

        // Wywołanie funkcji przypisującej zlecenie do freelancera
        assignFreelancerToJob(currentItem.id, freelancerId);
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
}

currentBox.addEventListener('mousedown', dragStart);
currentBox.addEventListener('mousemove', drag);
currentBox.addEventListener('mouseup', dragEnd);
currentBox.addEventListener('mouseleave', dragEnd);
currentBox.addEventListener('touchstart', dragStart);
currentBox.addEventListener('touchmove', drag);
currentBox.addEventListener('touchend', dragEnd);

window.onload = async function () {
    companiesData = await fetchCompanies();
    showItem();
};

// Dodaj obsługę zdarzeń dla przycisków
document.getElementById('detailsBtn').addEventListener('click', showPopup);
document.getElementById('closePopup').addEventListener('click', closePopup);
window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('popup')) {
        closePopup();
    }
});
