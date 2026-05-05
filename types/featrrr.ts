export type FeatrrrUser = {
  id: string;

  // Profile
  name: string;
  profileImage: string;

  // Trust layer
  rating: number;
  totalReviews: number;

  // Pricing
  startingPrice: number;

  // Role
  role: string; // "Videographer", "Photographer", etc.

  createdAt: string;
};
