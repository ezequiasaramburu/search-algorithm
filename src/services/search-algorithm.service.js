
/**
 * Creates a structured representation of the raw entities for efficient searching.
 * takes array of entities with id, name, type, and key properties
 * returns object containing two data structures:
 *   - matches: Organized entities by type
 *   - wordMatches: Map of individual words to their corresponding entities
 */
function createMatches(rawEntities) {
  // Initialize structure to hold entities grouped by their type
  const matches = {
    brand: [],
    city: [],
    diet: [],
    dish_type: [],
  };
  // Map to store individual words and their associated entities for quick lookup
  const wordMatches = new Map();

  // Process each entity and build our data structures
  rawEntities.forEach(entity => {
    const matchEntry = {
      entity: { id: entity.id, name: entity.name },
      matchedTerm: entity.key,
      words: entity.key.split(' ').filter(word => word),
    };
    matches[entity.type].push(matchEntry);
    
    // Build word-to-entity mapping for efficient word overlap checking
    matchEntry.words.forEach(word => {
      if (!wordMatches.has(word)) {
        wordMatches.set(word, []);
      }
      wordMatches.get(word).push({ 
        entityType: entity.type, 
        entity: matchEntry.entity,
        matchedTerm: matchEntry.matchedTerm 
      });
    });
  });

  return { matches, wordMatches };
}

/**
 * Normalizes a combination by sorting its keys to ensure consistent object structure
 * This helps in comparing combinations later
 */
function normalizeCombo(combo) {
  return Object.keys(combo)
    .sort()
    .reduce((obj, key) => {
      obj[key] = combo[key];
      return obj;
    }, {});
}

/**
 * Checks if a potential match has words that overlap with entities already in the combination
 * Overlapping can occur in two ways:
 * 1. A word from the new match is contained within an existing entity's name
 * 2. An existing entity's name is contained within one of the new match's words
 */
function hasOverlappingWords(match, currentCombo, wordMatches) {
  return match.words.some(word => {
    if (!wordMatches.has(word)) return false;
    
    // Check if this word is contained within any existing entity's name
    for (const type in currentCombo) {
      const entity = currentCombo[type];
      if (entity.name.toLowerCase().includes(word.toLowerCase())) {
        return true;
      }
    }
    
    // Check if any existing entity's name is contained within this word
    for (const type in currentCombo) {
      const entity = currentCombo[type];
      if (word.toLowerCase().includes(entity.name.toLowerCase())) {
        return true;
      }
    }
    
    return false;
  });
}

/**
 * Recursive function that builds all possible valid combinations of entities
 * Uses backtracking to explore all possibilities while respecting constraints
 * takes the combination being built
 * takes current position in the entity types array
 * takes organized entities by type
 * takes word-to-entity mapping
 * takes array of entity type names
 * takes array to store valid combinations
 */
function build(currentCombo, typeIndex, matches, wordMatches, entityTypesKeys, combinations) {
  // Base case: we've processed all entity types
  if (typeIndex >= entityTypesKeys.length) {
    if (Object.keys(currentCombo).length > 0) {
      combinations.push(normalizeCombo(currentCombo));
    }
    return;
  }

  const type = entityTypesKeys[typeIndex];
  
  // Recursive case 1: Skip this entity type entirely
  build(currentCombo, typeIndex + 1, matches, wordMatches, entityTypesKeys, combinations);

  // Recursive case 2: Try each possible entity of the current type
  matches[type].forEach(match => {
    // Only add if there's no word overlap and we haven't already added this type
    if (!hasOverlappingWords(match, currentCombo, wordMatches) && !currentCombo[type]) {
      const newCombo = { ...currentCombo, [type]: match.entity };
      build(newCombo, typeIndex + 1, matches, wordMatches, entityTypesKeys, combinations);
    }
  });
}

/**
 * Initiates the combination building process
 * returns array of all possible valid combinations
 */
function buildCombinations(matches, wordMatches) {
  const combinations = [];
  const entityTypesKeys = Object.keys(matches);
  build({}, 0, matches, wordMatches, entityTypesKeys, combinations);
  return combinations;
}

/**
 * Filters out redundant combinations where a smaller combination is completely
 * contained within a larger one with the same entities
 * Array of all generated combinations
 * returns filtered array with only the most specific combinations
 */
function filterCombinations(combinations) {
  return combinations.filter(combo =>
    !combinations.some(other => {
      if (JSON.stringify(combo) === JSON.stringify(other)) return false;
      return (
        Object.keys(combo).every(key => other[key] && other[key].id === combo[key].id) &&
        Object.keys(other).length > Object.keys(combo).length
      );
    })
  );
}

/**
 * Main entry point of the search algorithm
 * Takes raw entities and returns valid, filtered combinations
 * Array of raw entity objects
 * returns array of valid entity combinations
 */
export function findCombinations(rawEntities) {
  const { matches, wordMatches } = createMatches(rawEntities);
  const combinations = buildCombinations(matches, wordMatches);
  return filterCombinations(combinations);
} 