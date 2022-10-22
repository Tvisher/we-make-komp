'use strict';
import * as baseFunction from './modules/functions.js';
import './vendors/vendors.js';
import IMask from 'imask';
import offerPrint from './offerPrint.js';
baseFunction.testWebP();

function initApp() {
    // маска на поля где нужно вводить только числа
    document.querySelectorAll('.number-mask').forEach(input => {
        IMask(input, {
            mask: Number,
            thousandsSeparator: ' '
        });
    });

    // Плавное появление контента при загрузке страницы
    $('main').addClass('load');

    // HTML поля вывода данных
    const culcResultArea = document.querySelector('.calc-result');
    const dataFieldPrice = document.querySelector('[data-field-price]');
    const dataFieldSale = document.querySelector('[data-field-sale]');
    const dataFieldTotalPrice = document.querySelector('[data-field-total-price]');
    const calcOuterData = document.querySelector('.calc__outer-data');
    const offerDocument = document.querySelector('#offer-doc');
    const discountInput = document.querySelector('#developmentDiscount');


    // Массив с данными по выбраным услугам
    var estimateData = [];

    // Поле отображения списка услуг
    const estimatePreview = document.querySelector('#estimatePreview');

    // Функция генерации элементов списка услуг на основе массива данных  
    function renderPreview(serviceList) {
        // Показать/Скрыть предпросмотр сметы
        serviceList.length > 0 ? calcOuterData.classList.add('show') : calcOuterData.classList.remove('show')
        serviceList = serviceList.sort((a, b) => {
            return a.servicePriority - b.servicePriority;
        });
        const resList = serviceList.reduce((acc, service) => {
            const {
                optionPrice,
                optionTitle,
                optionDescription,
                solutionId
            } = service;

            const serviceItem = `
        <li class="list-item" data-id=${solutionId}>
        <div class="list-item__head">
            <div class="list-item__block list-item__name">
                <span class="list-item__nameplate">Наименование услуги</span>
                <div class="list-item__data" data-is-present>${optionTitle || "Имя услуги"}</div>
            </div>
            <div class="list-item__block">
                <span class="list-item__nameplate">Стоимость</span>
                <div class="list-item__data is-price">${(+optionPrice).toLocaleString('RU-ru')} ₸</div>
            </div>
            <div class="show_more"></div>
        </div>
        <div class="list-item__footer">
            <ul class="list-item__descr">
             ${optionDescription || ""}
            </ul>
        </div>
    </li>`;
            return acc += serviceItem;
        }, '');
        estimatePreview.innerHTML = resList;
        if (serviceList.length > 0) {
            culcResultArea.classList.add('show');
        } else {
            culcResultArea.classList.remove('show');
        }
        calculationResult(serviceList);
    }

    // Добавление нестандартного решения в список услуг
    function addSolution(e) {
        const target = e.target;
        if (!target.closest('[data-add-solution]')) return;
        const solutionBlock = target.closest('.solution');
        const solutionTitle = solutionBlock.querySelector('#solutionTitle');
        const solutionPrice = solutionBlock.querySelector('#solutionPrice').value
            .split(' ')
            .join('');

        let solutionText = solutionBlock.querySelector('#solutionArea');
        solutionText =
            solutionText.value.substring(0, solutionText.selectionStart) +
            "\n" +
            solutionText.value.substring(solutionText.selectionEnd, solutionText.value.length);
        solutionText = solutionText
            .split("\n")
            .filter(words => words.trim().length > 0)
            .map(words => {
                if (words.length > 0) {
                    return `<li>${words}</li>`;
                }
            })
            .join('');

        if (solutionText.length < 1 || solutionPrice.length < 1 || solutionTitle.value.length < 1) return;
        const solutionId = Math.random().toString(36).substring(2, 9);
        const dataObj = {
            optionPrice: solutionPrice,
            optionTitle: solutionTitle.value,
            optionDescription: solutionText,
            solutionId
        };
        estimateData.push(dataObj);
        renderPreview(estimateData);
        solutionBlock.querySelector('#solutionTitle').value = '';
        solutionBlock.querySelector('#solutionPrice').value = '';
        solutionBlock.querySelector('#solutionArea').value = '';
    }

    // Вывод данных калькуляции в итоговую стоимость на странице расчёта
    function calculationResult(dataArr) {
        const priceWidthoutSale = dataArr.reduce((acc, service) => {
            return acc + Number(service.optionPrice);
        }, 0);
        const discount = discountInput.value.trim();
        const sale = (priceWidthoutSale / 100) * discount;

        const totalPrice = priceWidthoutSale - sale;
        dataFieldPrice.innerHTML = priceWidthoutSale.toLocaleString('RU-ru');
        dataFieldSale.innerHTML = discount ? ` Скидка ${discount} % :<span >${sale.toLocaleString('RU-ru')}</span>₸` : '';
        dataFieldTotalPrice.innerHTML = totalPrice.toLocaleString('RU-ru');
    }

    function remooveSolution(target) {
        const targetSolutionBtn = target.closest('.show_more');
        if (!targetSolutionBtn) return;
        const targetSolution = targetSolutionBtn.closest('.list-item');
        const targetId = targetSolution.dataset.id;
        estimateData = estimateData.filter(item => item.solutionId !== targetId);
        renderPreview(estimateData);
    }

    // Прослушка кликов по документу
    document.addEventListener('click', (e) => {
        const target = e.target;
        addSolution(e);
        remooveSolution(target);
        // отправка на печать КП  
        if (target.closest('[data-print-offer]')) {
            offerDocument.classList.remove('no-print');
            offerDocument.classList.add('print');
            offerPrint(estimateData);
            offerDocument.classList.remove('print');
            offerDocument.classList.add('no-print');
        }
        if (target.closest('[data-update-offer]')) {
            calculationResult(estimateData);
        }
    });
}


const someString = 'Voxel987=';
const loginModal = document.querySelector('#login-modal');
const loginBtn = document.querySelector('#loginBtn');

if (sessionStorage.getItem('loginTrue')) {
    loginModal.classList.remove('show');
    initApp();
} else {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const someStringValue = document.querySelector('#passordField').value.trim();
        if (someStringValue === someString) {
            loginModal.classList.remove('show');
            initApp();
            sessionStorage.setItem('loginTrue', true);
        } else {
            alert('Пароль не верный!');
        }
    });
}
