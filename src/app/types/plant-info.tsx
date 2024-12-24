export interface PlantInfo {
  scientificName: InfoDetail;
  commonName: InfoDetail;
  family: InfoDetail;
  description: InfoDetail;
  nativeRegion: InfoDetail;
  growthType: InfoDetail;
  sunlightRequirements: InfoDetail;
  temperatureRequirements: InfoDetail;
  soilPreference: InfoDetail;
  waterNeeds: InfoDetail;
  bloomSeason: InfoDetail;
  propagationMethods: PropagationMethods;
  healthBenefits: InfoDetail;
  location: InfoDetail;
  name: string; 
  imageUrl: string;
}

export interface InfoDetail {
  short: string;
  detailed: string;
}

export interface PropagationMethods {
  short: string;
  detailed: string;
}
