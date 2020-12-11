const API_URL = 'https://www.juso.go.kr/addrlink/addrLinkApiJsonp.do';
const API_KEY = 'devU01TX0FVVEgyMDIwMTIxMTE0MDM0MjExMDUzODE=';
const form = document.querySelector('#form');
const addressList = document.querySelector('#address-list');
const submit = document.querySelector('.submit')
const mainContainer = document.querySelector('.main-container');

form.addEventListener('submit', async e => {
    e.preventDefault();
    const keyword = encodeURIComponent(form.keyword.value);
    try {
    const response = await search(keyword);
    const txt = await response.text();
    const result = JSON.parse(txt.replace(/^\(/, '').replace(/\)$/, '')).results;
    display(result);
    form.reset();
    addEventForAddressList();
    }
    catch (e) {
        console.error(e);
    }
});

submit.addEventListener('click', s => {
    s.preventDefault();
    if (form.keyword.value === '') {
        alert('배송지 주소를 입력해주세요!')
    }
    else {
        form.parentNode.removeChild(form);
        const h1 = document.createElement('h1');
        h1.innerHTML = '배송지 등록<br>성공!'
        h1.className = 'end-message'
        mainContainer.appendChild(h1);
    }
});

function search(keyword, currentPage = 1, countPerPage = 10) {
    const data = {
        confmKey: API_KEY,
        keyword,
        currentPage,
        countPerPage,
        resultType: 'json'
    };

    const body = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');

    const options = {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    };

    return fetch(API_URL, options);
}

function display(results) {            
    addressList.innerHTML = '';
    results.juso.forEach(item => {
        const li = document.createElement('li');
        li.className = 'address-li'
        li.innerHTML = `${item.zipNo}) ${item.roadAddr}`;
        addressList.appendChild(li);
    });
}

function addEventForAddressList() {
    const addressListButton = document.querySelectorAll('.address-li');
    for (var i = 0; i < addressListButton.length; i++) {
        const button = addressListButton[i]
        button.addEventListener('click', b => {
            const address = button.innerText;
            form.keyword.value = address;
            addressList.deleteChild('.address-li');
        });
    }
}


