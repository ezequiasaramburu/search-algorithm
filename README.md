# Search Algorithm Project

This project implements a search algorithm to find combinations of entities based on a search term.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd search-algorithm
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=[your-port]
DB_HOST=[your-host]
DB_PORT=[your-db-port]
DB_USER=[your-user]
DB_PASSWORD=[your-password]
DB_NAME=[your-db-name]
```

### 4. Create the Database

```bash
createdb [your-db-name]
```

### 5. Run Migrations

```bash
npx knex migrate:latest
```

### 6. Seed the Database

```bash
npx knex seed:run
```

### 7. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:{your-port}`.

### 8. Make a GET Request with a Search Term

Open your browser and navigate to:

```
http://localhost:{your-port}/search?q=your_search_term
```

Replace `your_search_term` with the term you want to search for.

## Running Tests

- Run tests once:

  ```bash
  npm test
  ```

- Run tests in watch mode (for development):
  ```bash
  npm run test:watch
  ```

## Project Structure

- `src/`: Source code
  - `controllers/`: API controllers
  - `services/`: Business logic
  - `db/`: Database configuration, migrations and seeds
  - `routes/`: API routes
  - `__tests__/`: Test files

## License

MIT

## Time Complexity Analysis

The current search algorithm has the following time complexity:

- **Worst Case:** O(t _ e^t _ w + c² \* k), where:

  - t is the number of entity types
  - e is the average number of entities per type
  - w is the average number of words per entity
  - c is the number of combinations generated
  - k is the number of keys in each combination

- **Best Case:** O(n \* m), when no combinations are found, where:
  - n is the number of entities
  - m is the average number of words per entity

### Explanation:

- The algorithm first processes all entities and their words: O(n \* m)
- Then builds combinations recursively for each entity type: O(t _ e^t _ w)
- Finally filters redundant combinations: O(c² \* k)

## Future Improvements

Here are some ideas to further enhance the search algorithm:

- **Performance Optimization:**

  - Implement early pruning in the combination building process to reduce the exponential growth (e^t)
  - Use a more efficient data structure (like a prefix tree) for word matching
  - Implement parallel processing for combination generation
  - Use database indexing for faster entity lookups

- **Algorithm Improvements:**

  - Implement a greedy approach to build combinations instead of the current recursive method
  - Implement a more efficient filtering mechanism to reduce the O(c²) complexity
  - Add early termination conditions when optimal combinations are found
  - Consider using a graph-based approach to represent entity relationships

- **Scalability:**

  - Implement pagination for large result sets
  - Add rate limiting to prevent server overload
  - Consider using a search engine like Elasticsearch for better scalability
  - Implement result caching with appropriate TTL (Time To Live)
  - Add database query optimization and proper indexing

- **Enhanced Matching:**
  - Add fuzzy matching to handle typos and similar words
  - Add support for partial word matching
