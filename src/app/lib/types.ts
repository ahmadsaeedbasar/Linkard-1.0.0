export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface UserProfile {
  name?: string;
  email?: string;
  about?: string;
  contact?: {
    phone?: string;
    website?: string;
  };
  tagline?: string;
  portfolio?: PortfolioItem[];
}
