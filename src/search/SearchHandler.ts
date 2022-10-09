import { Place } from '../Place.js';

export type SearchHandler = (error: Error | null, data?: Place[]) => void;
