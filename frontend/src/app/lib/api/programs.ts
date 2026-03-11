import { client } from './client';

export interface Program {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  image: string;
  category: string;
}

export const programApi = {
  getPrograms: () => 
    client.get<Program[]>('/programs'),
};
