import { arrShuffle } from './helpers.js';

async function getData(location) {
  const response = await fetch(location);
  if(response.ok) {
    const result = await response.json();
    return result;
  } else {
    console.log('ну, не шмогла я, не шмогла...');
  }
}

class dataStore {
  constructor(data) {
    this.users = data;
    this.popular = [];

    const LIST_LIMIT = 3;

    /**
     * получаем id всех пользователей
     */
    const userIDies = this.users.map(user => {
      return user.id;
    });

    this.users.forEach(user => {
      /**
       * находим людей, которые не в друзьях
       */
      const toExclude = [...user.friends, user.id];
      user.notFriends = userIDies.filter(userID => {
        return !toExclude.includes(userID);
      });

      /**
       * выбираем из "не друзей" случайных трёх
       */
      arrShuffle(user.notFriends);
      user.notFriends.splice(LIST_LIMIT);

      /**
       * заносим уровень популярности друзей
       * пользователя в поле rank их объектов
       */
      user['friends'].forEach(friendOfUser => {
        this.users.filter(user => {
          if (user.id === friendOfUser) {
            'rank' in user ? user.rank += 1 : user.rank = 1;
          }
        });
      });
    });

    /**
     * сортируем пользователей по популярности (по убыванию),
     * затем - по имени (по возрастанию)
     */
    const sortedByRankAndName = this.users.slice();
    const fields = ['rank', 'name'];
    const orders = [1, -1];
    
    sortedByRankAndName.sort(function(a, b) {
      for(let i = 0; i < fields.length; i++) {
        if(a[fields[i]] < b[fields[i]]) return orders[i];
        if(a[fields[i]] > b[fields[i]]) return -orders[i];
      }
    });

    /**
     * обрезаем по ограничинию на длину списка
     * и заносим в популярные
     */
    sortedByRankAndName.splice(LIST_LIMIT);
    this.popular = sortedByRankAndName;
  }
}

export { getData, dataStore };