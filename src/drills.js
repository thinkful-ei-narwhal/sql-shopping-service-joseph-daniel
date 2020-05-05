require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

// drill 1

function itemsText(searchTerm) {
  knexInstance
    .select()
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    
    })
    .finally(() => knexInstance.destroy());
}

// drill 2

function paginated(page) {
  const limit = 6;
  const offset = limit * (page - 1);

  knexInstance
    .select()
    .from('shopping_list')
    .limit(limit)
    .offset(offset)
    .then(result => {
      console.log(result);
    
    })
    .finally(() => knexInstance.destroy());
}

// drill 3

function itemsAfterDate(daysAgo){

  knexInstance
    .select()
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log(result);
    
    })
    .finally(() => knexInstance.destroy());
}

// drill4

function cost(){

  knexInstance
    .select('category')
    .sum('price as total_price')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log(result);
    
    })
    .finally(() => knexInstance.destroy());
}
