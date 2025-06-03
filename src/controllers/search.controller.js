import { searchEntities } from '../services/search.service.js';
import { findCombinations } from '../services/search-algorithm.service.js';

export const search = async (req, res) => {
  const { q: searchTerm } = req.query;
  
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const rawEntities = await searchEntities(searchTerm);
    const combinations = findCombinations(rawEntities);
    
    res.json(combinations);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
