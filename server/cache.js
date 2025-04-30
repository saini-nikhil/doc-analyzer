// cache.js
// LRU Cache implementation for AI responses

const dotenv = require('dotenv');
dotenv.config();

// Get cache size from environment variables or use default
const MAX_CACHE_SIZE = parseInt(process.env.CACHE_SIZE) || 100;

/**
 * LRU Cache implementation with O(1) operations for get, put, and delete
 * Uses a combination of Map (for O(1) lookups) and a doubly linked list (for O(1) insertions/deletions)
 */
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // For O(1) lookups
    this.head = { next: null, prev: null }; // Dummy head of doubly linked list
    this.tail = { next: null, prev: null }; // Dummy tail of doubly linked list
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.size = 0;
    this.hits = 0;
    this.misses = 0;
    this.mutex = Promise.resolve(); // Simple mutex for concurrency control
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} - Cached value or null if not found
   */
  async get(key) {
    // Use mutex to ensure thread safety
    return this._withMutex(() => {
      if (!this.cache.has(key)) {
        this.misses++;
        return null;
      }

      // Cache hit - move node to front (most recently used)
      const node = this.cache.get(key);
      this._removeNode(node);
      this._addToFront(node);
      this.hits++;
      
      return node.value;
    });
  }

  /**
   * Add or update value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @returns {Promise<void>}
   */
  async put(key, value) {
    return this._withMutex(() => {
      // If key exists, update value and move to front
      if (this.cache.has(key)) {
        const node = this.cache.get(key);
        node.value = value;
        this._removeNode(node);
        this._addToFront(node);
        return;
      }

      // If at capacity, remove least recently used item (from tail)
      if (this.size === this.capacity) {
        const lruNode = this.tail.prev;
        this._removeNode(lruNode);
        this.cache.delete(lruNode.key);
        this.size--;
      }

      // Add new node to front
      const newNode = { key, value, next: null, prev: null };
      this._addToFront(newNode);
      this.cache.set(key, newNode);
      this.size++;
    });
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getStats() {
    const hitRate = this.hits + this.misses > 0 
      ? (this.hits / (this.hits + this.misses) * 100).toFixed(2) 
      : 0;
    
    return {
      size: this.size,
      capacity: this.capacity,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate}%`
    };
  }

  /**
   * Clear the cache
   * @returns {Promise<void>}
   */
  async clear() {
    return this._withMutex(() => {
      this.cache.clear();
      this.head.next = this.tail;
      this.tail.prev = this.head;
      this.size = 0;
    });
  }

  /**
   * Helper method to remove a node from the doubly linked list
   * @param {Object} node - Node to remove
   * @private
   */
  _removeNode(node) {
    const prev = node.prev;
    const next = node.next;
    prev.next = next;
    next.prev = prev;
  }

  /**
   * Helper method to add a node to the front of the doubly linked list
   * @param {Object} node - Node to add
   * @private
   */
  _addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  /**
   * Mutex implementation for thread safety
   * @param {Function} fn - Function to execute with mutex
   * @returns {Promise<any>} - Result of the function
   * @private
   */
  async _withMutex(fn) {
    // Create a new mutex promise that resolves when the previous one completes
    const previousMutex = this.mutex;
    let releaseMutex;
    
    // Create a new promise that will be resolved when we want to release the mutex
    this.mutex = new Promise(resolve => {
      releaseMutex = resolve;
    });
    
    // Wait for the previous mutex to resolve before proceeding
    await previousMutex;
    
    try {
      // Execute the function while holding the mutex
      return fn();
    } finally {
      // Release the mutex
      releaseMutex();
    }
  }
}

// Create singleton instance
const aiResponseCache = new LRUCache(MAX_CACHE_SIZE);

/**
 * Generate a cache key from a prompt
 * @param {string} prompt - The AI prompt
 * @returns {string} - Cache key
 */
function generateCacheKey(prompt) {
  // Simple hash function for the prompt
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `prompt_${hash}`;
}

module.exports = {
  aiResponseCache,
  generateCacheKey
};
