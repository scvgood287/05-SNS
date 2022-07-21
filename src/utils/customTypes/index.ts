import { SortOrder } from 'mongoose';

export type OrderByType = 'createdAt' | 'likes' | 'views';
export type OrderBysType = OrderByType[];
export type SortOptions = string | { [key: string]: SortOrder | { $meta: 'textScore' } } | undefined | null;
