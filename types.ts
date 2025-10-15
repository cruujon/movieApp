// types.ts
export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average: number;
  overview?: string;
  backdrop_path?: string | null;
}

export type MovieList = { 
  page: number; 
  results: Movie[]; 
  total_pages: number;
  total_results: number;
}

export type WatchProviders = {
  results?: {
    JP?: {
      flatrate?: { 
        provider_id: number; 
        provider_name: string; 
        logo_path: string;
      }[];
      link?: string;
    }
  }
}

export type MovieDetail = Movie & {
  genres?: { id: number; name: string }[];
  runtime?: number;
  status?: string;
  tagline?: string;
  credits?: {
    cast?: { 
      id: number; 
      name: string; 
      character?: string; 
      profile_path?: string | null;
    }[];
  };
}

export type SearchParams = {
  q?: string;
  page?: number;
}
