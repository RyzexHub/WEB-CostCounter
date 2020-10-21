const rub = " ₽";   // Символ рубля для конкатенации с выводимыми суммами

rowCounter();
amountCounter();

var keyDown_D = false; // Переменная-статус для определения удержания клавиши D (Delete)
var keyDown_E = false; // Переменная-статус для определения удержания клавиши E (Edit)

// Получаем поля ввода + кнопку и сразу вешаем на них событие для изменения состояния кнопки
var inputName = document.querySelector("#name");
var inputCategory = document.querySelector("#category");
var inputAmount = document.querySelector("#amount");
var button = document.querySelector("button");
inputName.addEventListener("keyup", buttonStateToggle);
inputCategory.addEventListener("change", buttonStateToggle);
inputAmount.addEventListener("keyup", buttonStateToggle);
button.addEventListener("click", addRow);

// Вешаем событие, когда нажимается клавиша D или E, меняем переменную-статус на "нажато"
document.addEventListener("keydown", function(event) {
    if (event.code == "KeyD") {
        keyDown_D = true;
    }
    else if (event.code == "KeyE") {
        keyDown_E = true;
    }
});
// Вешаем событие, когда отжимается клавиша D или E, меняем переменную-статус на "не нажато"
document.addEventListener("keyup", function(event) {
    if (event.code == "KeyD") {
        keyDown_D = false;
    }
    else if (event.code == "KeyE") {
        keyDown_E = false;
    }
});
// Вешаем событие по клику на все строки в теле каждой таблицы
for (let i = 0; i < document.querySelectorAll("tbody tr").length; i++) {
    document.querySelectorAll("tbody tr")[i].addEventListener("click", function() {
        console.log(event.currentTarget);
        // removeRow(event.currentTarget);
    });
}
// Вешаем событие по клику на все строки "Наименование", "Сумма" в теле каждой таблицы
for (let i = 0; i < document.querySelectorAll("tbody td").length; i++) {
    document.querySelectorAll("tbody td")[i].addEventListener("click", function() {
        editCell(event.currentTarget);
    });
}

// Функция ведущая подсчёт количества строк в таблице. Если вызвать "по дефолту", без параметров - считает количество строк во всех таблицах сразу (необходимо в самом начале), если передать id таблицы - посчитает строки только в указанной таблице.
function rowCounter(tableId = "all") {
    let tablesCount = document.querySelectorAll("table");

    if (tableId == "all") {
        for (let i = 0; i < tablesCount.length; i++) {
            for (let j = 0; j < tablesCount[i].querySelectorAll("tbody tr").length; j++) {
                tablesCount[i].querySelectorAll("tbody th")[j].innerText = j + 1;
            }
        }
    }
    else {
        for (let i = 0; i < document.querySelectorAll(tableId + " tbody tr").length; i++) {
            document.querySelectorAll(tableId + " tbody th")[i].innerText = i + 1;
        }
    }
}

// Функция складывающая сумму, указанную в каждой строке конкретной таблицы. Необходимо указать id таблицы в которой нужно просчитать итог.
// document.querySelector(tableId + " tbody").childElementCount - конструкция, выводящая численное значение количества строк в конкретной таблице
// Number(document.querySelector(tableId + " tbody").children[i].querySelector("td:last-child").innerText.split(" ")[0]) - конструкция, получающая значение ячейки с суммой в указанной строке и отделяющая от него только, приведенное к численному типу, значение
function rowAdder(tableId) {
    let buffer = 0;

    for (let i = 0; i < document.querySelector(tableId + " tbody").childElementCount; i++) {
        buffer += Number(document.querySelector(tableId + " tbody").children[i].querySelector("td:last-child").innerText.split(" ")[0]);
    }

    return buffer;
}

// Функция, считающая промежуточные суммы для каждой таблицы и итоговую сумму
function amountCounter() {
    // Получаем ячейки таблиц, в которых будет содержатся итоговая сумма за таблицу
    let foodTotalCell = document.querySelector("#food .tfoot-total-amount");
    let entertainmentTotalCell = document.querySelector("#entertainment .tfoot-total-amount");
    let purchasesTotalCell = document.querySelector("#purchases .tfoot-total-amount");
    let transportTotalCell = document.querySelector("#transport .tfoot-total-amount");
    let clothingTotalCell = document.querySelector("#clothing .tfoot-total-amount");
    let otherTotalCell = document.querySelector("#other .tfoot-total-amount");

    // Получаем span для вывода суммарного итога
    let totalAmount = document.querySelector(".total-amount-sum");

    // Устанавливаем в ячейки таблиц, отвечающие за сумму по таблице, значения, соответствующие табличным итогам
    foodTotalCell.innerText = rowAdder("#food") + rub;
    entertainmentTotalCell.innerText = rowAdder("#entertainment") + rub;
    purchasesTotalCell.innerText = rowAdder("#purchases") + rub;
    transportTotalCell.innerText = rowAdder("#transport") + rub;
    clothingTotalCell.innerText = rowAdder("#clothing") + rub;
    otherTotalCell.innerText = rowAdder("#other") + rub;

    // В расчёте итоговой суммы, формально, мы просто складываем строки всех таблиц в одно значение. Создание отдельной буферной переменной для этого дела, пока что, не является чем-то осмысленным.
    totalAmount.innerText = rowAdder("#food") + rowAdder("#entertainment") + rowAdder("#purchases") + rowAdder("#transport") + rowAdder("#clothing") + rowAdder("#other") + rub;
}

// Функция проверяет есть ли в поле ввода наименования содержимое и выбрана ли категория с суммой. Если да - активирует кнопку
function buttonStateToggle() {
    if (inputName.value != "" && inputCategory.value != "default" && inputAmount.value != "") {
        button.removeAttribute("disabled");
    } 
    else {
        button.setAttribute("disabled", "");
    }
}

// Функция для добавления новых строк при помощи полей ввода
function addRow() {
    // Создаём "элементы" строки
    let row = document.createElement("tr");
    let rowNumber = document.createElement("th");
    let rowName = document.createElement("td");
    let rowAmount = document.createElement("td");

    // Устанавливаем для созданных элементов необходимые атрибуты и значения
    rowNumber.setAttribute("scope", "row");
    rowNumber.innerText = document.querySelector("#" + inputCategory.value + " tbody").childElementCount + 1;
    rowName.innerText = inputName.value;
    rowAmount.innerText = inputAmount.value + rub;

    // По-очереди добавляем в качестве детей ячейки с номером, наименованием, суммой к строке
    row.append(rowNumber);
    row.append(rowName);
    row.append(rowAmount);

    // Добавляем в конец тела таблицы строку в качестве ребенка
    document.querySelector("#" + inputCategory.value + " tbody").append(row);

    amountCounter();
    buttonStateToggle();
    // saveData(inputCategory.value);

    // После добавления сбрасываем значения полей формы на дефолтные
    inputName.value = "";
    inputCategory.value = "default";
    inputAmount.value = "";
}

// Функция удаляющая строку. Принимает в качестве параметра объект, по которому кликнул пользователь.
function removeRow(row) {
    if (keyDown_D == true) {
        let getTableId = row.offsetParent.id;

        if (confirm("Вы уверены что хотите удалить эту строку?")) {
            row.remove();
            rowCounter("#"+getTableId);
            amountCounter();
        }

        keyDown_D = false; // Необходимо, иначе возникает баг, после confirm состояние кнопки D не изменяется (т.е. остаётся в статусе нажатой)
    }
}

// Функция изменяющая содержимое ячейки. Принимает в качестве параметра объект, по которому кликнул пользователь.
function editCell(cell) {
    if (keyDown_E == true) {
        let cellValue = prompt("Введите новое значение ячейки.\nТекущее значение: " + cell.innerText, cell.innerText);

        if (cellValue != "" && cellValue != null) {
            if (cell.className == "amount") {
                if (cellValue.split(" ").length == 2 && cellValue.split(" ")[1] == "₽") {
                    cell.innerText = cellValue;
                }
                else {
                    cell.innerText = cellValue + rub;
                }
                amountCounter();
            }
            else {
                cell.innerText = cellValue;
            }
        }

        keyDown_E = false; // Необходимо, иначе возникает баг, после prompt состояние кнопки E не изменяется (т.е. остаётся в статусе нажатой)
    }
}

// function saveData(tableId) {
//     let saveString = "";

//     for (let i = 0; i < document.querySelectorAll("#" + tableId + " tbody tr").length; i++) {
//         if ((i+1) == document.querySelectorAll("#" + tableId + " tbody tr").length) {
//             saveString += "\"row"+(i+1)+"\":{\"name\":\""+document.querySelectorAll("#" + tableId + " tbody td:first-of-type")[i].innerText+"\",\"amount\":"+document.querySelectorAll("#" + tableId + " tbody .amount")[i].innerText.split(" ")[0]+"}";
//                break;
//         }
//         saveString += "\"row"+(i+1)+"\":{\"name\":\""+document.querySelectorAll("#" + tableId + " tbody td:first-of-type")[i].innerText+"\",\"amount\":"+document.querySelectorAll("#" + tableId + " tbody .amount")[i].innerText.split(" ")[0]+"},";
//     }
    
//     saveString = "{"+saveString+"}";
//     localStorage.setItem(tableId, saveString);
// }