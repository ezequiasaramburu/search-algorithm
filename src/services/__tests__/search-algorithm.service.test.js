import { findCombinations } from '../search-algorithm.service.js';

describe('Search Algorithm Service', () => {
  describe('findCombinations', () => {
    it('should return empty array for empty input', () => {
      const result = findCombinations([]);
      expect(result).toEqual([]);
    });

    it('should find combinations for single entity type', () => {
      const rawEntities = [
        { id: 1, name: 'London', type: 'city', key: 'london' },
        { id: 2, name: 'Manchester', type: 'city', key: 'manchester' }
      ];

      const result = findCombinations(rawEntities);
      expect(result).toEqual([
        { city: { id: 1, name: 'London' } },
        { city: { id: 2, name: 'Manchester' } }
      ]);
    });

    it('should find combinations for multiple entity types', () => {
      const rawEntities = [
        { id: 1, name: 'McDonalds', type: 'brand', key: 'mcdonalds' },
        { id: 2, name: 'London', type: 'city', key: 'london' },
        { id: 3, name: 'Vegetarian', type: 'diet', key: 'vegetarian' }
      ];

      const result = findCombinations(rawEntities);
      expect(result).toEqual([
        {
          brand: { id: 1, name: 'McDonalds' },
          city: { id: 2, name: 'London' },
          diet: { id: 3, name: 'Vegetarian' }
        }
      ]);
    });

    it('should not create combinations with overlapping words', () => {
      const rawEntities = [
        { id: 1, name: 'McDonalds London', type: 'brand', key: 'mcdonalds london' },
        { id: 2, name: 'London', type: 'city', key: 'london' }
      ];

      const result = findCombinations(rawEntities);
      expect(result).toEqual([
        { city: { id: 2, name: 'London' } },
        { brand: { id: 1, name: 'McDonalds London' } }
      ]);
    });

    it('should handle case-insensitive word matching', () => {
      const rawEntities = [
        { id: 1, name: 'MCDONALDS', type: 'brand', key: 'mcdonalds' },
        { id: 2, name: 'mcdonalds', type: 'brand', key: 'mcdonalds' }
      ];

      const result = findCombinations(rawEntities);
      expect(result).toEqual([
        { brand: { id: 1, name: 'MCDONALDS' } },
        { brand: { id: 2, name: 'mcdonalds' } }
      ]);
    });

    it('should filter out redundant combinations', () => {
      const rawEntities = [
        { id: 1, name: 'McDonalds', type: 'brand', key: 'mcdonalds' },
        { id: 2, name: 'London', type: 'city', key: 'london' },
        { id: 3, name: 'McDonalds London', type: 'brand', key: 'mcdonalds london' }
      ];

      const result = findCombinations(rawEntities);
      expect(result).toEqual([
        { brand: { id: 1, name: 'McDonalds' }, city: { id: 2, name: 'London' } },
        { brand: { id: 3, name: 'McDonalds London' } }
      ]);
    });
  });
}); 