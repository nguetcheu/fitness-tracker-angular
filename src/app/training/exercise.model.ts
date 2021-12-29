export interface Exercise {
    id: string;
    name: string;
    duree: number;
    calories: number;
    date?: Date;
    state?: 'complet' | 'annuler' | null;
}
