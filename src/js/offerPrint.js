

export default function offerPrint(estimateData) {
    const discountInput = document.querySelector('#developmentDiscount');

    const companyName = document.querySelector('#companyName');
    const dataCompanyName = document.querySelector('[data-id="companyName"]');
    dataCompanyName.innerHTML = companyName.value;

    const kpType = document.querySelector('#kpType');
    const dataKpType = document.querySelector('[data-id="kpType"]');
    dataKpType.innerHTML = kpType.value;

    const klpDescr = document.querySelector('#klpDescr');
    const dataKlpDescr = document.querySelector('[data-id="klpDescr"]');
    dataKlpDescr.innerHTML = klpDescr.value;

    // Вывод актуальной даты составления КП
    const currentDateField = document.querySelector('[data-id="currentDate"]');
    let Data = new Date();
    let Year = Data.getFullYear();
    let Month = Data.getMonth();
    let Day = Data.getDate();
    let fMonth;

    // Преобразуем месяца
    switch (Month) {
        case 0: fMonth = "января"; break;
        case 1: fMonth = "февраля"; break;
        case 2: fMonth = "марта"; break;
        case 3: fMonth = "апреля"; break;
        case 4: fMonth = "мае"; break;
        case 5: fMonth = "июня"; break;
        case 6: fMonth = "июля"; break;
        case 7: fMonth = "августа"; break;
        case 8: fMonth = "сентября"; break;
        case 9: fMonth = "октября"; break;
        case 10: fMonth = "ноября"; break;
        case 11: fMonth = "декабря"; break;

    }

    currentDateField.innerHTML = Day + " " + fMonth + " " + Year + " года";

    // Формирование списка услуг в строки таблицы
    const tableRows = estimateData.reduce((row, dataItem) => {
        const { selectName,
            optionTitle,
            optionDescription,
            optionPrice,
            optionCount, } = dataItem;

        const calculationItem = `
        <tr>
            <td>
                <span class="setvise-table-title">${optionTitle}</span>
              
            </td>
            <td>${optionDescription}</td>
       
            <td class="center-text">${(+optionPrice).toLocaleString('ru-RU')} ₸</td>
        </tr>`;
        row += calculationItem;
        return row;
    }, '');

    // Поле вывода строк таблицы расчёта
    const dataRenderRows = document.querySelector('[data-render-rows]');
    dataRenderRows.innerHTML = tableRows;

    const implementationPeriod = document.querySelector('#implementationPeriod');
    const dataImplementationPeriodField = document.querySelector('[data-implementation-period]');
    dataImplementationPeriodField.innerHTML = implementationPeriod.value ? `Срок разработки:&nbsp;<span>${implementationPeriod.value} рабочих дней</span>` : '';

    const dataTotalRes = document.querySelector('[data-total-res]');
    const dataSaleRes = document.querySelector('[data-sale-res]');
    const dataFinalRes = document.querySelector('[data-final-res]');

    const totalRes = estimateData.reduce((acc, item) => {
        return acc + +item.optionPrice;
    }, 0);
    dataTotalRes.innerHTML = totalRes.toLocaleString('RU-ru');

    const saleRes = (totalRes / 100) * discountInput.value;
    dataSaleRes.innerHTML = saleRes > 0 ? `Скидка ${discountInput.value}% :&nbsp;<span>${saleRes.toLocaleString('RU-ru')}</span>&nbsp;<span>₸</span>` : '';
    dataFinalRes.innerHTML = (totalRes - saleRes).toLocaleString('RU-ru');

    // Печать документа
    window.print();
}


