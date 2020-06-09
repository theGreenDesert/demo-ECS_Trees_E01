//! первая карточка

var alfa_tree = new ECSTree('z 001'); // {data: 'z 001', parent: null, children: [],
alfa_tree._root.tier = 0; // tier: 0,
alfa_tree._root.id = 1; // id: 1}


//! вывод данных на страницу

addTodayData();

createList(alfa_tree);

buttonAdd(alfa_tree);

buttonDel(alfa_tree);

//! END