import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
}

interface SearchFilters {
  query: string;
  category: string;
  priceRange: string;
  radius: number;
  minRating: number;
  amenities: string[];
  sortBy: string;
}

interface AppStore {
  // User location
  userLocation: UserLocation | null;
  setUserLocation: (location: UserLocation | null) => void;

  // Search
  searchFilters: SearchFilters;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Map
  mapCenter: [number, number];
  mapZoom: number;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;

  // UI
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isFilterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  category: '',
  priceRange: '',
  radius: 25,
  minRating: 0,
  amenities: [],
  sortBy: 'relevance',
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // User location
      userLocation: null,
      setUserLocation: (location) => set({ userLocation: location }),

      // Search
      searchFilters: defaultFilters,
      setSearchFilters: (filters) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        })),
      resetFilters: () => set({ searchFilters: defaultFilters }),

      // Map - Default: India center
      mapCenter: [20.5937, 78.9629],
      mapZoom: 5,
      setMapCenter: (center) => set({ mapCenter: center }),
      setMapZoom: (zoom) => set({ mapZoom: zoom }),

      // UI
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      isFilterOpen: false,
      setFilterOpen: (open) => set({ isFilterOpen: open }),
    }),
    {
      name: 'wanderlocal-store',
      partialize: (state) => ({
        userLocation: state.userLocation,
        searchFilters: state.searchFilters,
      }),
    }
  )
);
