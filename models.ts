import Record from "pocketbase";

export type BaseModel = {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
} & Record

export type UserModel = {
    username: string;
    email: string;
    avatar: string;
    aboutMe?: string;
    telephone?: string;
    terms: boolean;
    verified: boolean;
} & BaseModel