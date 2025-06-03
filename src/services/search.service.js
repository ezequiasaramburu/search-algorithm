import knex from '../db/knex.js';
import { generateNgrams } from '../utils/ngram.util.js';
import { ENTITY_TYPES } from '../types/entities.js';

export async function searchEntities(searchTerm) {
  const ngrams = generateNgrams(searchTerm);
  if (ngrams.length === 0) return [];

  const unionQueries = ENTITY_TYPES.map(({ table, type }) => {
    const subquery = knex
      .select(
        'id',
        'name',
        knex.raw('? as type', [type]),
        knex.raw('LOWER(name) as key')
      )
      .from(table)
      .where(function () {
        ngrams.forEach(ngram => {
          this.orWhereRaw('LOWER(name) LIKE ?', [`%${ngram}%`]);
        });
      })
      .limit(15);

    return subquery;
  });

  const finalQuery = knex
    .select('*')
    .from(
      knex
        .queryBuilder()
        .select('*')
        .from(function () {
          this.unionAll(unionQueries, true).as('entities');
        })
        .as('final')
    );

  return finalQuery;
}
