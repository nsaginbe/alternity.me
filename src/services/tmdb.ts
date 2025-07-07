// TMDb API service for celebrity photos
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''; // You'll need to get this from TMDb
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface TMDbPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
}

interface TMDbSearchResponse {
  page: number;
  results: TMDbPerson[];
  total_pages: number;
  total_results: number;
}

export class TMDbService {
  private static instance: TMDbService;
  private cache: Map<string, string> = new Map();

  static getInstance(): TMDbService {
    if (!TMDbService.instance) {
      TMDbService.instance = new TMDbService();
    }
    return TMDbService.instance;
  }

  /**
   * Search for a celebrity by name and return their photo URL
   */
  async getCelebrityPhoto(name: string): Promise<string | null> {
    try {
      // Check cache first
      if (this.cache.has(name)) {
        return this.cache.get(name)!;
      }

      if (!TMDB_API_KEY) {
        console.warn('TMDb API key not configured');
        return null;
      }

      const response = await fetch(
        `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(name)}`
      );

      if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status}`);
      }

      const data: TMDbSearchResponse = await response.json();
      
      if (data.results && data.results.length > 0) {
        const person = data.results[0];
        if (person.profile_path) {
          const photoUrl = `${TMDB_IMAGE_BASE_URL}${person.profile_path}`;
          this.cache.set(name, photoUrl);
          return photoUrl;
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching celebrity photo:', error);
      return null;
    }
  }

  /**
   * Get multiple celebrity photos at once
   */
  async getCelebrityPhotos(names: string[]): Promise<Map<string, string | null>> {
    const results = new Map<string, string | null>();
    
    // Process requests in parallel but with rate limiting
    const batchSize = 5;
    for (let i = 0; i < names.length; i += batchSize) {
      const batch = names.slice(i, i + batchSize);
      const batchPromises = batch.map(async (name) => {
        const photo = await this.getCelebrityPhoto(name);
        return { name, photo };
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(({ name, photo }) => {
        results.set(name, photo);
      });

      // Small delay between batches to respect rate limits
      if (i + batchSize < names.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * Clear the photo cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const tmdbService = TMDbService.getInstance(); 