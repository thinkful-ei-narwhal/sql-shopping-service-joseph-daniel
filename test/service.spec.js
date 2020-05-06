const ShoppingService = require('../src/service');
const knex = require('knex');

describe('Shopping service object', () => {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'Chicken Noodle Spoof',
      price: '2.50',
      category: 'Lunch',
      checked: false,
      date_added: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      name: 'Chili non-carne',
      price: '5.88',
      category: 'Main',
      checked: true,
      date_added: new Date('2019-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      name: 'Pep-parody Pizza',
      price: '4.00',
      category: 'Lunch',
      checked: false,
      date_added: new Date('2028-01-22T16:28:32.615Z'),
    },
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.DB_TEST_URL,
    });
  });

  before(() => {
    return db('shopping_list').truncate();
  });

  afterEach(() => {
    return db('shopping_list').truncate();
  });

  

  after(() => db.destroy());

  context('if shopping_list has data', () => {
    beforeEach(() => {
      return db.into('shopping_list').insert(testItems);
    });
    it('gets all items from the db', () => {
      return ShoppingService.getAllItems(db)
        .then(actualData =>{
          expect(actualData).to.eql(testItems);
        });
    });
    it('getSingleItem() gets an item by its id', () => {
      const thirdId = 3;
      const thirdTestItem = testItems[thirdId - 1];
      return ShoppingService.getSingleItem(db, thirdId)
        .then(data => {
          expect(data).to.eql({
            id: thirdId,
            name: thirdTestItem.name,
            price: thirdTestItem.price,
            category: thirdTestItem.category,
            checked: thirdTestItem.checked,
            date_added: new Date(thirdTestItem.date_added),
          });
        });
    });
    it('deleteItem() removes item by id', () => {
      const itemId = 2;
      return ShoppingService.deleteItem(db, itemId)
        .then(() => ShoppingService.getAllItems(db))
        .then(allItems => {
          const expected = testItems.filter(item => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });
    it('updateItem() updates an item', () => {
      const idUpdate = 1;
      const newstuff = {

        category: "Lunch",
        checked: false,
        date_added: new Date('2029-01-22T16:28:32.615Z'),
        name: 'updated name',
        price: '8000.00'
      };
      return ShoppingService.updateItem(db, idUpdate, newstuff)
        .then(() => ShoppingService.getSingleItem(db, idUpdate))
        .then(item => {
          expect(item).to.eql({
            ...newstuff,
            id: idUpdate,
          });
        });
    });
  });

  context('given the shopping_list has no data', () => {
    it('returns an empry array', () => {
      return ShoppingService.getAllItems(db)
        .then(actualData =>{
          expect(actualData).to.eql([]);
        });
    });
    it('insertItem() inserts a new item', () => {
      const newItem = {
        name: 'I need Pizza',
        price: '0.10',
        category: 'Main',
        checked: true,
        date_added: new Date('2020-01-22T16:28:32.615Z'),
      };
      return ShoppingService.insertItem(db, newItem)
        .then(data => {
          expect(data).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            category: newItem.category,
            checked: newItem.checked,
            date_added: new Date(newItem.date_added),
          });
        });
    });
  });

  
});