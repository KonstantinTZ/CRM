//====================================================================================================================================
//вызов окна удалить

function callDeletePopup() {

  document.querySelector('.popup-rc').classList.add('open');

  document.querySelector('.popup-rc__btn-close').addEventListener('click', function () {
    document.querySelector('.popup-rc').classList.remove('open');
  });

  document.querySelector('.popup-rc__btn-cancel').addEventListener('click', function () {
    document.querySelector('.popup-rc').classList.remove('open');
  });

}

// закрыть модальное окно при наджатии ЭСКЕЙП
window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    document.querySelector('.popup-rc').classList.remove("open")
  }
});

//====================================================================================================================================
//вызов окна добавить

document.querySelector('.main__add-button').addEventListener('click', function () {
  document.querySelector('.popup-new').classList.add('open');
  document.getElementById('new-client-title').classList.remove('hidden')
  document.getElementById('change-client-title').classList.add('hidden')
  document.getElementById('new-client-cancel-btn').classList.remove('hidden')
  document.getElementById('open-delete-popup').classList.add('hidden')
  document.getElementById('btn-add-client').classList.remove('hidden')
  document.getElementById('btn-change-client').classList.add('hidden')
})


document.querySelector('.popup-new__btn-close').addEventListener('click', function () {
  document.querySelector('.popup-new').classList.remove('open');
  cleanPopUp()

});

document.getElementById('new-client-cancel-btn').addEventListener('click', function () {
  document.querySelector('.popup-new').classList.remove('open');
  cleanPopUp()

});

// закрыть модальное окно при наджатии ЭСКЕЙП
window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    document.querySelector('.popup-new').classList.remove("open")
  }
});

//====================================================================================================================================
// Вызов окна изменить

function callChangePopup() {

  document.querySelector('.popup-new').classList.add('open');
  document.getElementById('new-client-title').classList.add('hidden')
  document.getElementById('change-client-title').classList.remove('hidden')
  document.getElementById('new-client-cancel-btn').classList.add('hidden')
  document.getElementById('open-delete-popup').classList.remove('hidden')
  document.getElementById('btn-add-client').classList.add('hidden')
  document.getElementById('btn-change-client').classList.remove('hidden')
  document.getElementById('open-delete-popup').addEventListener('click', function () {
    document.querySelector('.popup-new').classList.remove('open');
    // document.querySelector('.popup-rc').classList.add('open');

    surnameInput.value = ''
    nameInput.value = ''
    lastnameInput.value = ''
    popUpErrorField.value = ''

    let contactblockArray = document.querySelectorAll('.contact-block')
    for (const item of contactblockArray) {
      item.remove()
    }

    let NumberizedId = Number(idInput.textContent)


    callDeletePopup()
    document.getElementById('btn-delete-client').addEventListener('click', function () {
      //удаляем клиента с сервера
      deleteClientFromServer(NumberizedId)
    });
    idInput.textContent = ''
  });

}

//====================================================================================================================================
// кастомный селект работает с плагином

function choisesCall() {
  const selectStyle = document.querySelectorAll('.contact-block__select');

  selectStyle.forEach(el => {
    const choices = new Choices(el, {
      searchEnabled: false,
      position: 'auto',
      itemSelectText: ' ',
      allowHTML: true,
    });
  })
}

//вызываю работу плагина
choisesCall()


//====================================================================================================================================
// ф-я создания блока с контактом

function addFormContacts(type, value) {

  let choisesArray = ['Телефон', 'Email', 'VK', 'Facebook']
  let select = document.createElement('select')
  select.classList.add('contact-block__select')

  for (const item of choisesArray) {
    let option = document.createElement('option')
    option.classList.add('contact-block__option')
    option.value = item
    option.textContent = item
    select.appendChild(option)
  }

  for (let i = 0; i < select.length; i++) {
    if (select[i].value === type) select[i].selected = true;
  }

  let contactBlock = document.createElement('div')
  let contactInput = document.createElement('input')
  contactInput.setAttribute('type', 'text')



  select.addEventListener('change', function () {

    contactsPlaceholders(select.value, contactInput)


  })

  // добавление ИНпут Маск

  contactInput.addEventListener('click', function () {
    
    mask('phone', {
      mask: '+{7}(000)000-00-00',
      lazy: false,
    })

    mask('vk', {
      mask: '{vk.com/id}[000000000000]',
      lazy: false,
    })

    mask('fb', {
      mask: '{f\\acebook.com/id}[000000000000]',
      lazy: false,
    })

  })

  contactsPlaceholders(select.value, contactInput)

  if (value === null || value === undefined) {
    contactInput.value = ''
  } else {
    contactInput.value = value
  }
  let contactDeleteButton = document.createElement('button')


  contactDeleteButton.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
     </svg>
     `

  contactBlock.classList.add('add-form__contact-block', 'contact-block', 'd-flex', 'align-items-center', 'justify-content-center')
  contactInput.classList.add('contact-block__inp')
  contactDeleteButton.classList.add('contact-block__btn-close', 'btn', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center')
  contactBlockWrapper.append(contactBlock)
  contactBlock.append(select)
  contactBlock.append(contactInput)
  contactBlock.append(contactDeleteButton)

  choisesCall()

  // при нажатии на кнопку удалить контакт
  contactDeleteButton.addEventListener('click', function () {
    contactBlock.remove()

    // заново активирует кнопку добавить контакт, если колличество контактов менее 10 шт
    document.getElementById('btn-add-contact').removeAttribute("disabled");
  })
}

//====================================================================================================================================
// inputmask



const mask = (dataValue, options) => { // создаем универсальную функцию
  const elements = document.querySelectorAll(`[data-mask="${dataValue}"]`) // ищем поля ввода по селектору с переданным значением data-атрибута
  if (!elements) return console.log('я не сработал') // если таких полей ввода нет, прерываем функцию

  elements.forEach(el => { // для каждого из полей ввода
    IMask(el, options) // инициализируем плагин imask для необходимых полей ввода с переданными параметрами маски
  })
}

//====================================================================================================================================
// ф-я добавления плейсхолдеров 

function contactsPlaceholders(value, contactInput) {


  if (value === 'Телефон') {
    contactInput.classList.add('input-tel')

    contactInput.classList.remove('input-email')
    contactInput.classList.remove('input-VK')
    contactInput.classList.remove('input-facebook')

    contactInput.placeholder = '+7 (9**) ***-**-**'
    contactInput.dataset.mask = 'phone'


  }
  if (value === 'Email') {
    contactInput.classList.add('input-email')

    contactInput.classList.remove('input-tel')
    contactInput.classList.remove('input-VK')
    contactInput.classList.remove('input-facebook')
    contactInput.placeholder = 'example@mail.ru'

    contactInput.dataset.mask = 'email'
  }
  if (value === 'VK') {
    contactInput.classList.add('input-VK')

    contactInput.classList.remove('input-email')
    contactInput.classList.remove('input-tel')
    contactInput.classList.remove('input-facebook')

    contactInput.placeholder = 'vk.com/id***'
    contactInput.innerHTML = 'vk.com/id'

    contactInput.dataset.mask = 'vk'
  }
  if (value === 'Facebook') {
    contactInput.classList.add('input-facebook')

    contactInput.classList.remove('input-email')
    contactInput.classList.remove('input-VK')
    contactInput.classList.remove('input-tel')

    contactInput.placeholder = 'facebook.com/id***'
    contactInput.textContent = 'facebook.com/id'
    contactInput.dataset.mask = 'fb'
  }
}

//====================================================================================================================================
// при нажатии на кнопку добавить контакт
let addFormContainer = document.querySelector('.add-form__container')
let contactBlockWrapper = document.querySelector('.contact-block-wrapper')

document.getElementById('btn-add-contact').addEventListener('click', function (elem) {
  elem.preventDefault()
  addFormContacts(null, null)
  let contactBlock = document.querySelectorAll('.add-form__contact-block') //получаем nodeList - потом преобразовываем в массив
  contactBlock = Array.prototype.slice.call(contactBlock); // теперь elems - массив
  if (contactBlock.length >= 10) {
    document.getElementById('btn-add-contact').setAttribute('disabled', '')
  }
})

//====================================================================================================================================
//Удаляем клиентов с сервера
async function deleteClientFromServer(clientObjId) {
  const response = await fetch(`http://localhost:3000/api/clients/${clientObjId}`, {
    method: 'DELETE',
  });
  if (response.status === 404)
    console.log('Не удалось удалить клиента, так как его не существует');
  const data = await response.json();
  console.log(data);
}


//====================================================================================================================================
// загружаем список клиентов с сервера
async function loadClientsArrFromServer() {
  const response = await fetch('http://localhost:3000/api/clients');
  // если загрузилось с сервера, то убираем прелоадер
  if (response.ok) document.querySelector('.preloader').classList.add('preloader--hidden')
  return await response.json();
}

// получаем данные с сервера
let data = await loadClientsArrFromServer()

//====================================================================================================================================
// Создайте массив объектов клиентов.Добавьте в него объекты клиентов.


let clientsArray = []

// обязательная штука, иначе все зависнет
// полученные данные с сервера записываем в массив(основной с которым работаем)
if (data !== '' && data !== null) {
  clientsArray = data
}

//====================================================================================================================================
//ф-я по загрузке одного клиента с сервера

async function getClientItemFromServer(clientId) {
  const response = await fetch(`http://localhost:3000/api/clients/${clientId}`);
  // если получили ответ, закрываем прелоадер
  if (response.ok) document.querySelector('.popup-new__preloader').classList.add('popup-new__preloader--hidden')
  const data = await response.json();
  console.log(data);
  return await data
}

//====================================================================================================================================
//открытие по ссылке

window.addEventListener('hashchange', async function(event) {
  callChangePopup()
    document.querySelector('.popup-new__preloader').classList.remove('popup-new__preloader--hidden')
    // загружаем занные конкретного клиента заново с сервера, вдруг там что то изменилось
    let clientObjFromServer = await getClientItemFromServer(window.location.hash.slice(1))
    renderChangeForm(clientObjFromServer.id, clientObjFromServer.surname, clientObjFromServer.name, clientObjFromServer.lastName, clientObjFromServer.contacts)
})

//=====================================================================================================================================
//Создайте функцию вывода одного студента в таблицу, по аналогии с тем, как вы делали вывод одного дела в модуле 8. Функция должна вернуть html элемент с информацией и пользователе.У функции должен быть один аргумент - объект студента.
let tableBody = document.querySelector('.table__tbody')

function getClientItem(client, clientsArray) { // аргумент индекс в массиве , массив студентов
  let clientObj
  clientObj = clientsArray[client] // для удобства работы выделяем объект

  let tableRow = document.createElement('tr') // создаем строку в таблицу
  let firstColumn = document.createElement('td') // создаем колонку в строке
  let secondColumn = document.createElement('td')
  let threedColumn = document.createElement('td')
  let fourthColumn = document.createElement('td')
  let fivesColumn = document.createElement('td')
  let sixtColumn = document.createElement('td')
  //ссылка на клиента
  let seventhColumn = document.createElement('td')


  let changeButton = document.createElement('button')
  changeButton.classList.add('btn', 'table__btn', 'table__btn-change')
  changeButton.textContent = 'Изменить'

  changeButton.addEventListener('click', async function () {
    callChangePopup()
    // При клике вставляем прелоадер на попАп, убираем только когда ответ с сервера успешен, он записан в ф-е получения клиента с сервера
    document.querySelector('.popup-new__preloader').classList.remove('popup-new__preloader--hidden')
    // загружаем занные конкретного клиента заново с сервера, вдруг там что то изменилось
    let clientId = clientObj.id
    let clientObjFromServer = await getClientItemFromServer(clientId)
    renderChangeForm(clientObjFromServer.id, clientObjFromServer.surname, clientObjFromServer.name, clientObjFromServer.lastName, clientObjFromServer.contacts)

    // создаем хеш часть, что бы можно было делиться ссылкой
    
  })

  let deleteButton = document.createElement('button')
  deleteButton.classList.add('btn', 'table__btn', 'table__btn-delete')
  deleteButton.textContent = 'Удалить'

  deleteButton.addEventListener('click', function (elem) {
    elem.preventDefault()
    callDeletePopup()
    document.getElementById('btn-delete-client').addEventListener('click', function () {
      //удаляем клиента с сервера
      deleteClientFromServer(clientObj.id)
      tableRow.remove()
    });
  })


  let openButton = document.createElement('button')
  openButton.classList.add('table__btn-open')

  firstColumn.textContent = clientObj.id
  firstColumn.classList.add('table__text-decoration-dim')
  secondColumn.textContent = clientObj.surname + ' ' + clientObj.name + ' ' + clientObj.lastName; // данные из объекта выгружаем в соответствующие колонки

  let crateClientDate = document.createElement('span')
  crateClientDate.classList.add('table__create-date')
  crateClientDate.textContent = renderDate(clientObj.createdAt) + ' '

  let crateClientTime = document.createElement('span')
  crateClientTime.classList.add('table__create-time', 'table__text-decoration-dim')
  crateClientTime.textContent = renderTime(clientObj.createdAt)

  let changeClientDate = document.createElement('span')
  changeClientDate.classList.add('table__change-date')
  changeClientDate.textContent = renderDate(clientObj.updatedAt) + ' '

  let changeClientTime = document.createElement('span')
  changeClientTime.classList.add('table__change-time', 'table__text-decoration-dim')
  changeClientTime.textContent = renderTime(clientObj.updatedAt)

  fivesColumn.classList.add('table__fives-column') // превратить объект в точки , 'd-flex', 'flex-wrap'

  for (const item of clientObj.contacts) {

    let clientContactBulletItem = document.createElement('span')
    let clientContactBulletImage = document.createElement('img')

    if (item.type === 'Телефон') clientContactBulletImage.src = 'img/contact-bullet-phone.svg'
    if (item.type === 'Email') clientContactBulletImage.src = 'img/contact-bullet-mail.svg'
    if (item.type === 'VK') clientContactBulletImage.src = 'img/contact-bullet-VK.svg'
    if (item.type === 'Facebook') clientContactBulletImage.src = 'img/contact-bullet-facebook.svg'

    clientContactBulletItem.append(clientContactBulletImage)

    clientContactBulletItem.dataset.tippyContent = item.type + ': ' + item.value
    clientContactBulletItem.classList.add('table__bullet')

    fivesColumn.append(clientContactBulletItem)


    if (clientObj.contacts.length >= 5) {
      openButton.textContent = `+${clientObj.contacts.length - 4}`
      fivesColumn.append(openButton)
    }

    openButton.addEventListener('click', function () {
      clientContactBulletItem.classList.add('table__bullet--visible')
      openButton.classList.add('hidden')
    })
  }

  let clientsLink = document.createElement('a')
  clientsLink.classList.add('table__link')
  clientsLink.innerHTML = 'Ссылка'

  clientsLink.setAttribute('href', `${window.location}#${clientObj.id}`) //${window.location} более корректно т.к. берет реальный адрес
  clientsLink.dataset.tippyContent = 'Нажмите правой кнопкой мыши и выбирете пункт: "Копировать адрес ссылки"'

  tableBody.appendChild(tableRow) // добавляем эти колонки в  ШТМЛ

  tableRow.appendChild(firstColumn)
  tableRow.appendChild(secondColumn)
  tableRow.appendChild(threedColumn)

  threedColumn.append(crateClientDate)
  threedColumn.append(crateClientTime)

  tableRow.appendChild(fourthColumn)

  fourthColumn.append(changeClientDate)
  fourthColumn.append(changeClientTime)

  tableRow.appendChild(fivesColumn)
  tableRow.appendChild(sixtColumn)

  sixtColumn.append(changeButton)
  sixtColumn.append(deleteButton)

  tableRow.appendChild(seventhColumn)
  seventhColumn.append(clientsLink)

}

//====================================================================================================================================
// ф-я реддера всей таблицы

function renderClientsTable(clientsArray) {
  for (let item in clientsArray) {
    getClientItem(item, clientsArray)
  }

  // Для работы библиотеки ТИПИИ. данные записаны в ДАТА-АТРИБУТ
  // запускается при каждом рендере таблицы
  tippy('[data-tippy-content]')

  tippy('span', {
    content: 'Global content',
    trigger: 'click',
  });

}

// получили массив, отрендерили
renderClientsTable(clientsArray)

//====================================================================================================================================
// ф-я очистки всей таблицы

let table = document.getElementById('table')

function clearTable() {
  table.removeChild(tableBody)
  tableBody = document.createElement('tbody');
  tableBody.classList.add('table__tbody');
  table.appendChild(tableBody);
}

//====================================================================================================================================
// ф-я высчитавания даты из данных получаемых с сервера

function renderDate(incomDate) { // ф-я для вычесления даты
  let date = new Date(incomDate)
  let result = ''
  if (date.getDate() < 10) {
    result = result + '0'
  }
  result = result + date.getDate() + '.'
  if (date.getMonth() < 9) {

    result = result + '0'
  }
  result = result + (date.getMonth() + 1) + '.'

  result = result + date.getFullYear()

  return result
}

function renderTime(incomDate) { // ф-я для вычесления времени
  let date = new Date(incomDate)
  let result = ''
  if (date.getHours() < 10) {
    result = result + '0'
  }
  result = result + date.getHours() + ':'
  if (date.getMinutes() < 9) {

    result = result + '0'
  }
  result = result + date.getMinutes()


  return result
}

//====================================================================================================================================
// рендерим данные из массив на попап ИЗМЕНИТЬ КОНТАКТ

let idInput = document.getElementById('id-value')
let surnameInput = document.getElementById('input-surname')
let nameInput = document.getElementById('input-name')
let lastnameInput = document.getElementById('input-lastname')
let popUpErrorField = document.querySelector('.popup-new__error-msg-box')


function renderChangeForm(id, surname, name, lastName, contactsArray) {
  idInput.textContent = id
  surnameInput.value = surname
  nameInput.value = name
  lastnameInput.value = lastName

  for (let item of contactsArray) {
    addFormContacts(item.type, item.value)
  }
}

//====================================================================================================================================
// ф-я очистки формы попапа

function cleanPopUp() {
  idInput.textContent = ''
  surnameInput.value = ''
  nameInput.value = ''
  lastnameInput.value = ''
  popUpErrorField.value = ''

  let contactblockArray = document.querySelectorAll('.contact-block')
  for (const item of contactblockArray) {
    item.remove()
  }

  // заново активирует кнопку добавить контакт
  document.getElementById('btn-add-contact').removeAttribute("disabled");
}


//====================================================================================================================================
// действия при нажатии на кнопку Сохранить НА попапе добавить нового клиента

document.getElementById('btn-add-client').addEventListener('click', async function (event) {
  event.preventDefault();
  let newClient = {}
  let formContactArr = []


  let contactBlock = document.querySelectorAll('.add-form__contact-block')

  contactBlock = Array.prototype.slice.call(contactBlock); // теперь elems - массив

  for (let i = 0; i < contactBlock.length; i++) {
    let formContactObg = {}
    formContactObg.type = contactBlock[i].querySelector('.contact-block__select').value
    formContactObg.value = contactBlock[i].querySelector('.contact-block__inp').value
    formContactArr.push(formContactObg)
  }


  newClient.name = nameInput.value.slice(0, 1).toUpperCase() + nameInput.value.slice(1)
  newClient.surname = surnameInput.value.slice(0, 1).toUpperCase() + surnameInput.value.slice(1)
  newClient.lastName = lastnameInput.value.slice(0, 1).toUpperCase() + lastnameInput.value.slice(1)
  newClient.contacts = formContactArr




  // если соблюдаются условия , то отправляем данные из инпутов на сервер, ИНАЧЕ выводим сообщения и НЕ отправляем на сервер

  if (nameInput !== '' && surnameInput !== '' && formContactArr.length >= 1 && document.querySelector('.contact-block__inp').value !== '') {


    // Этап перевода на сервер
    document.querySelector('.popup-new__preloader').classList.remove('popup-new__preloader--hidden')
    await createNewClientServer(newClient)

    // clientsArray.push(newClient)
    
    

  } else {
    document.querySelector('.popup-new__error-msg-box').innerHTML = "Заполните все поля в форме со звездочкам  <br> и добавьте хотя бы один контакт";

  }
})

//====================================================================================================================================
// Ф-я отправки на сервер !


async function createNewClientServer(clientObj) { // ИСПРАВЛЕНО
  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: clientObj.name,
      surname: clientObj.surname,
      lastName: clientObj.lastName,
      contacts: clientObj.contacts
    })
  });
  if (response.ok) {
    document.querySelector('.popup-new__preloader').classList.add('popup-new__preloader--hidden')
    //если респонс - ОК закрываем ПОАП, чистим попап, чистим tbody,загружаем новый список криентов с сервера в Аррей, рендерим таблицу из Нового Аррея, чистим поле ошибок
    document.querySelector('.popup-new').classList.remove('open');
    cleanPopUp()
    clearTable()
    loadClientsArrFromServer()
    renderClientsTable(clientsArray)
    document.querySelector('.popup-new__error-msg-box').innerHTML = ' '
    
  } else {
    document.querySelector('.popup-new__preloader').classList.add('popup-new__preloader--hidden')
      if (response.status !== 422 || response.status !== 404) {
      popUpErrorField.innerHTML = 'Что то пошло не так ...' + ' Status: ' + response.status + '  '

    }

  }
  const data = await response.json();
  console.log(data);


  console.log(data.errors.length)

  for (const item of data.errors) {
    popUpErrorField.innerHTML += item.message + '  , '
  }
}


//====================================================================================================================================
// Ф-я изменения на сервере !

async function changeClientServer(clientObj) { // ИСПРАВЛЕНО
  const response = await fetch(`http://localhost:3000/api/clients/${clientObj.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: clientObj.name,
      surname: clientObj.surname,
      lastName: clientObj.lastName,
      contacts: clientObj.contacts
    })
  });
  if (response.ok) {
    document.querySelector('.popup-new__preloader').classList.add('popup-new__preloader--hidden')
    //если респонс - ОК закрываем ПОАП, чистим попап, чистим tbody,загружаем новый список криентов с сервера в Аррей, рендерим таблицу из Нового Аррея, чистим поле ошибок
    document.querySelector('.popup-new').classList.remove('open');
    cleanPopUp()
    clearTable()
    loadClientsArrFromServer()
    renderClientsTable(clientsArray)
    document.querySelector('.popup-new__error-msg-box').innerHTML = ' '
  } else {
    //ЕСЛИ Респонс не ОК, то обрвтно убираем прелоадер и выводим ссобщения об ошибках
    document.querySelector('.popup-new__preloader').classList.add('popup-new__preloader--hidden')
    // alert("Ошибка HTTP: " + response.status);
    console.log(response.status)

    if (response.status !== 422 || response.status !== 404) {
      popUpErrorField.innerHTML = 'Что то пошло не так ...' + ' Status: ' + response.status + '  '

    }

  }
  const data = await response.json();
  console.log(data);


  console.log(data.errors.length)

  for (const item of data.errors) {
    popUpErrorField.innerHTML += item.message + '  , '
  }

}


//====================================================================================================================================
// Ф-я при нажатии кнопки сохранить при изменении данных клиента !

document.getElementById('btn-change-client').addEventListener('click', function (elem) {
  elem.preventDefault();

  let changedClient = {}
  let formContactArr = []


  let contactBlock = document.querySelectorAll('.add-form__contact-block')

  contactBlock = Array.prototype.slice.call(contactBlock); // теперь elems - массив

  for (let i = 0; i < contactBlock.length; i++) {
    let formContactObg = {}
    formContactObg.type = contactBlock[i].querySelector('.contact-block__select').value
    formContactObg.value = contactBlock[i].querySelector('.contact-block__inp').value
    formContactArr.push(formContactObg)
  }

  changedClient.id = document.getElementById('id-value').innerHTML
  changedClient.name = nameInput.value.slice(0, 1).toUpperCase() + nameInput.value.slice(1)
  changedClient.surname = surnameInput.value.slice(0, 1).toUpperCase() + surnameInput.value.slice(1)
  changedClient.lastName = lastnameInput.value.slice(0, 1).toUpperCase() + lastnameInput.value.slice(1)
  changedClient.contacts = formContactArr

  if (nameInput !== '' && surnameInput !== '' && formContactArr.length >= 1 && document.querySelector('.contact-block__inp').value !== '') {

    document.querySelector('.popup-new__preloader').classList.remove('popup-new__preloader--hidden')
    changeClientServer(changedClient)

    // clientsArray.push(changedClient)
    clearTable()
    renderClientsTable(clientsArray)
    document.querySelector('.popup-new__error-msg-box').innerHTML = ' '


  } else {
    document.querySelector('.popup-new__error-msg-box').innerHTML = "Заполните все поля в форме со звездочкам <br> и добавьте хотя бы один контакт";

  }

});

//====================================================================================================================================
// ф-я пулучения массива клиентов по поисковому запросу с СЕРВЕРА

async function getSearchFromServer(searchBarValue) {
  const response = await fetch(`http://localhost:3000/api/clients/?search=${searchBarValue}`);
  if (response.ok) document.querySelector('.preloader').classList.add('preloader--hidden')
  if (response.ok) document.querySelector('.table__tbody').classList.remove('hidden')
  const data = await response.json();
  return await data
}

let filter = document.getElementById('search-bar')
let timeout

filter.addEventListener('keyup', function (elem) {
  elem.preventDefault();
  document.querySelector('.table__tbody').classList.add('hidden')
  document.querySelector('.preloader').classList.remove('preloader--hidden')
  //ждем 300 мс, пока закончитвя ввод в строке поиска и отпраляем запрос
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    let searchBarValue = filter.value
    clientsArray = await getSearchFromServer(searchBarValue)
    renderClientsTable(clientsArray)
    clearTable()
    renderClientsTable(clientsArray)
  }, 300)
})

//====================================================================================================================================
// Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.

// columnName внизу
let sortId = document.querySelector('.table__thead-id')
let sortFio = document.querySelector('.table__theadp-fio')
let sortCreateDate = document.querySelector('.table__thead-create-date')
let sortChangeDate = document.querySelector('.table__thead-change-date')


function sortArray(incomArray, property, direction = false) {
  let result = incomArray.sort(function (a, b) {
    let directionOfSorting = a[property] < b[property];
    if (direction == true) directionOfSorting = a[property] > b[property];
    if (directionOfSorting) return -1
  })

  return result;
}

function sortColumns(columnName, clientProperty, mainArr) {

  columnName.addEventListener('click', function () {
    columnName.classList.toggle('table__thead-col--active');
    let switcher
    if (columnName.classList.contains('table__thead-col--active')) {
      switcher = true
    } else {
      switcher = false
    }

    sortArray(mainArr, clientProperty, switcher)
    clearTable()
    renderClientsTable(mainArr)
  })

}

sortColumns(sortId, 'id', clientsArray)
sortColumns(sortFio, 'surname', clientsArray)
sortColumns(sortCreateDate, 'createdAt', clientsArray)
sortColumns(sortChangeDate, 'updatedAt', clientsArray)