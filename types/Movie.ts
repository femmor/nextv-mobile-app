import { User } from "./User";

export interface Movie {
    _id: string;
    title: string;
    caption: string;
    director: string;
    releaseYear: number;
    image: string;
    user: User;
    rating: number;
    createdAt: string;
}