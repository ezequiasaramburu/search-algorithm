import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { removeDuplicatesByName } from '../../utils/helper.util.js';

function parseCsv(filePath) {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

export async function seed(knex) {
  await knex('brand').del();
  await knex('city').del();
  await knex('diet').del();
  await knex('dish_type').del();

  const [brands, cities, diets, dishTypes] = await Promise.all([
    parseCsv(path.resolve('src/db/seeds/csv/brands.csv')),
    parseCsv(path.resolve('src/db/seeds/csv/cities.csv')),
    parseCsv(path.resolve('src/db/seeds/csv/diets.csv')),
    parseCsv(path.resolve('src/db/seeds/csv/dish_types.csv')),
  ]);

  await knex('brand').insert(removeDuplicatesByName(brands));
  await knex('city').insert(removeDuplicatesByName(cities));
  await knex('diet').insert(removeDuplicatesByName(diets));
  await knex('dish_type').insert(removeDuplicatesByName(dishTypes));
}
