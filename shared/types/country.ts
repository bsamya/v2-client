export type Country = {
  id: string;
  dosFees: number;
  nusaccFees: number;
  notaryFees: string;
  nusac: boolean;
  embassyProcessingTime: number;
  nusaccProcessingTime: number;
  authenticationType: "Apostille" | "Legalization";
  embassyFees: number;
  service: number;
  nusacc: boolean;
  dosProcessingTime: number;
  countryCode: string;
  authenticationServiceFees: number;
  deptofstate: boolean;
  service_fees: number;
  workdays: number;
  special_requirements: null;
  name: Record<string, string>;
  secretaryofstate_fees: number;
  sosProcessingTime: number;
  apostille_fees: number;
  nusac_fees: number;
  processingTime: number;
  dos: number;
  code: string;
  sos: number;
  lng: string;
  deptofstate_fees: number;
  countryName: string;
  hasSecondaryRegions: boolean;
  embassy_fees: number;
  serviceFees: number;
  notaryProcessingTime: number;
  secretaryofstate: null;
  embassy: {
    fees: number;
    processingTime: number;
    serviceFees: number;
  };
  embassy_hasTieredFees: boolean;
  countrygroup: string;
  apostille: boolean;
  authenticationFees: number;
  lat: string;
  sosFees: number;
};

export type CountryISO = Record<string, {
  en: string;
  ar: string;
  es: string;
  zh: string;
  bg?: string;
  br?: string;
  cs?: string;
  da?: string;
  de?: string;
  el?: string;
  eo?: string;
  et?: string;
  eu?: string;
  fa?: string;
  fi?: string;
  fr?: string;
  hr?: string;
  hu?: string;
  hy?: string;
  it?: string;
  ja?: string;
  ko?: string;
  lt?: string;
  nl?: string;
  no?: string;
  pl?: string;
  pt?: string;
  ro?: string;
  ru?: string;
  sk?: string;
  sl?: string;
  sr?: string;
  sv?: string;
  th?: string;
  tr?: string;
  uk?: string;
  "zh-tw"?: string;
}>;


export type CountrySettings = {
  notary: {
    fees: number;
    processingTime: number;
    serviceFees: number;
  };
  secretaryOfState: {
    fees: number;
    processingTime: number;
    serviceFees: number;
  };
  departmentOfState: {
    fees: number;
    processingTime: number;
    serviceFees: number;
  };
};