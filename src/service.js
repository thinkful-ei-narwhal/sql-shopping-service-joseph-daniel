const ShoppingService = {
  getAllItems(db){
    return db.select().from('shopping_list');
  },

  getSingleItem(db, id){
    return db('shopping_list').select().where('id', id).first();
  },

  insertItem(db, item){
    return db('shopping_list')
      .insert(item)
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  updateItem(db, id, newData){
    return db('shopping_list')
      .where({id}).update(newData);
  },

  deleteItem(db, id){
    return db('shopping_list')
      .where({id}).delete();
  },
};

module.exports = ShoppingService;