interface CountryDetails {
  borders: {
    commonName: string;
    officialName: string;
    countryCode: string;
    region: string;
  }[];
  flag: string;
  populationCounts: {
    year: number;
    value: number;
  }[];
}
