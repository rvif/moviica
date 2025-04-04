export interface Movie {
  id: number;
  title: string;
  poster_path: string | null; // Can be null if no poster
  overview?: string;
  release_date?: string;
  vote_average?: number; // Can be null if no rating
  watched: boolean;
  whereToWatch: string;
}
