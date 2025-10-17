export type User = {
    _id?: string;
    id?: string; // Backend sends 'id' instead of '_id'
    username: string;
    email: string;
    profileImage: string;
    createdAt: string;
    updatedAt?: string;
};
