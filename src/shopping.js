require('dotenv').config();
const knex = require('knex');
const ShoppingService = require('./service');

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

ShoppingService.getAllItems(db)
  .then(items => console.log(items))
  .then(() => {
    return ShoppingService.insertItem(db, {
      name: 'New title',
      price: '10.00',
      category: 'Main',
      checked: true,
      date_added: new Date(),
    });
  })
  .then(newItem => {
    console.log(newItem);
    return ShoppingService.updateItem(db, newItem.id, {name: 'Updated name'})
      .then(() => ShoppingService.getSingleItem(db, newItem.id));
  })
  .then(item => {
    console.log(item);
    return ShoppingService.deleteItem(db, item.id);
  });
