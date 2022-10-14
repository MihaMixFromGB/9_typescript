export interface Place {
  id: string;
  image: string;
  name: string;
  description: string;
  remoteness: number;
  bookedDates: number[];
  price: number;
  favorite: boolean;
  provider?: PlaceProvider
}

export enum PlaceProvider {
  homy = 'homy',
  flatRent = 'flatRent'
}
