// Static celebrity photos service
// This is a fallback for when TMDb API is not available

interface StaticCelebrity {
  name: string;
  image: string;
  description?: string;
}

// You can add more celebrities and their photos here
const STATIC_CELEBRITIES: StaticCelebrity[] = [
  {
    name: "Ryan Reynolds",
    image: "/api/placeholder/400/400?text=RR",
    description: "Canadian actor"
  },
  {
    name: "Emma Stone",
    image: "/api/placeholder/400/400?text=ES",
    description: "American actress"
  },
  {
    name: "Chris Evans",
    image: "/api/placeholder/400/400?text=CE",
    description: "American actor"
  },
  {
    name: "Scarlett Johansson",
    image: "/api/placeholder/400/400?text=SJ",
    description: "American actress"
  },
  {
    name: "Leonardo DiCaprio",
    image: "/api/placeholder/400/400?text=LD",
    description: "American actor"
  },
  {
    name: "Jennifer Lawrence",
    image: "/api/placeholder/400/400?text=JL",
    description: "American actress"
  },
  {
    name: "Brad Pitt",
    image: "/api/placeholder/400/400?text=BP",
    description: "American actor"
  },
  {
    name: "Margot Robbie",
    image: "/api/placeholder/400/400?text=MR",
    description: "Australian actress"
  },
  {
    name: "Robert Downey Jr.",
    image: "/api/placeholder/400/400?text=RDJ",
    description: "American actor"
  },
  {
    name: "Angelina Jolie",
    image: "/api/placeholder/400/400?text=AJ",
    description: "American actress"
  }
];

export class StaticCelebrityService {
  private static instance: StaticCelebrityService;
  private celebrityMap: Map<string, StaticCelebrity> = new Map();

  constructor() {
    // Create a searchable map
    STATIC_CELEBRITIES.forEach(celebrity => {
      this.celebrityMap.set(celebrity.name.toLowerCase(), celebrity);
    });
  }

  static getInstance(): StaticCelebrityService {
    if (!StaticCelebrityService.instance) {
      StaticCelebrityService.instance = new StaticCelebrityService();
    }
    return StaticCelebrityService.instance;
  }

  /**
   * Find a celebrity by name (case-insensitive)
   */
  findCelebrity(name: string): StaticCelebrity | null {
    return this.celebrityMap.get(name.toLowerCase()) || null;
  }

  /**
   * Get celebrity photo URL by name
   */
  getCelebrityPhoto(name: string): string | null {
    const celebrity = this.findCelebrity(name);
    return celebrity ? celebrity.image : null;
  }

  /**
   * Get all available celebrities
   */
  getAllCelebrities(): StaticCelebrity[] {
    return [...STATIC_CELEBRITIES];
  }

  /**
   * Search celebrities by partial name match
   */
  searchCelebrities(query: string): StaticCelebrity[] {
    const lowercaseQuery = query.toLowerCase();
    return STATIC_CELEBRITIES.filter(celebrity =>
      celebrity.name.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Export singleton instance
export const staticCelebrityService = StaticCelebrityService.getInstance();

// Utility function to add your own celebrity images
export const addCustomCelebrity = (name: string, imagePath: string, description?: string) => {
  STATIC_CELEBRITIES.push({
    name,
    image: imagePath,
    description
  });
  
  // Update the map
  staticCelebrityService.getAllCelebrities().forEach(celebrity => {
    staticCelebrityService['celebrityMap'].set(celebrity.name.toLowerCase(), celebrity);
  });
};

// Example usage:
// addCustomCelebrity("Tom Hanks", "/assets/celebrities/tom-hanks.jpg", "American actor"); 