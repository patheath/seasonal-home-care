export interface HomeProfile {
  id: string
  userId: string
  homeType: 'single_family' | 'condo' | 'townhouse'
  yearBuilt: number
  region: string
  squareFootage?: number
  features: HomeFeature[]
  createdAt: string
  updatedAt: string
}

export type HomeFeature =
  | 'pool'
  | 'hot_tub'
  | 'fireplace'
  | 'deck'
  | 'basement'
  | 'crawl_space'
  | 'septic'
  | 'well_water'
  | 'irrigation'
  | 'solar_panels'

export interface HomeProfileFormData {
  homeType: HomeProfile['homeType']
  yearBuilt: number
  region: string
  squareFootage?: number
  features: HomeFeature[]
}
