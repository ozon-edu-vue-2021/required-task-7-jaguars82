import { usersFilterByID } from './helpers.js';

/**
 * открытие списков отдельного пользователя
 */
const openDetails = function(userData, data) {
  const listContainer = document.querySelector('#container');
  const backButton = document.querySelector('.back');
  
  listContainer.classList.add('details');
  backButton.addEventListener("click", closeDetails);

  const friends = usersFilterByID(data.users, userData.friends);
  const notFriends = usersFilterByID(data.users, userData.notFriends);

  buildDetails(friends, notFriends, data.popular);
}

/**
 * закрытие списков отдельного пользователя,
 * возвращение к общему списку
 */
const closeDetails = function() {
  const listContainer = document.querySelector('#container');
  const activeUserContainer = document.querySelector('#container.details .list-view li.active');
  const backButton = document.querySelector('.back')
  const detailsContainer = document.querySelector('.details-view ul');
  
  detailsContainer.innerHTML = '';
  listContainer.classList.remove('details');
  activeUserContainer.classList.remove('active');
  backButton.removeEventListener("click", closeDetails);
}

/**
 * отрисовка общего списка
 */
function buildList(data, target) {
  const list = document.createDocumentFragment();

  const renderListItem = function(itemData, allUsers) {
    const elem = document.createElement('li');
    elem.innerHTML = `<strong>${itemData.name}</strong>`;
    elem.onclick = function() {
      elem.classList.add('active');
      openDetails(itemData, allUsers);
    };
    return elem;
  }

  for(let user of data.users) {
    list.appendChild(renderListItem(user, data));
  }

  target.appendChild(list);
}

/**
 * отрисовка списков отдельного пользователя
 */
function buildDetails(friends, notFriends, populars) {
  const renderListItem = function(itemData) {
    const elem = document.createElement('li');
    elem.innerHTML = `<li><i class="fa fa-male"></i><span>${itemData.name}</span></li>`;
    return elem;
  };

  const renderSubList = function(listItems, title, target) {
    const list = document.createDocumentFragment();

    const sublistHeader = document.createElement('li');
    sublistHeader.classList.add("people-title");
    sublistHeader.innerText = title;

    list.appendChild(sublistHeader);

    for(let item of listItems) {
      list.appendChild(renderListItem(item));
    }

    target.appendChild(list);
  };

  const listContainer = document.querySelector('.details-view ul');

  renderSubList(friends, 'Друзья', listContainer);
  renderSubList(notFriends, 'Не в друзьях', listContainer);
  renderSubList(populars, 'Популярные люди', listContainer);
}

export { buildList, buildDetails };