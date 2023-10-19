import {RecordModel} from "pocketbase";

export type UserModel = {
    username: string;
    email: string;
    avatar: string | null;
    aboutMe: string | null; // max 500 chars
    jobTitle: string | null; // max 50 chars
    terms: boolean;
    verified: boolean;
} & RecordModel

export type UserViewModel = Pick<UserModel, "username" | "avatar"> & RecordModel

export type ProjectModel = {
    name: string; // 3-30 chars
    description: string | null;
    emoji: string;
    members: string[];
    expand?: {
        members?: UserModel[];
    }
} & RecordModel

export type TopicModel = {
    name: string; // 3-30 chars
    project: string;
    expand?: {
        project?: ProjectModel;
    }
} & RecordModel

export type MessageModel = {
    text: string; // max 500 chars
    author: string;
    project: string;
    readBy: string[];
    replyTo: string | null;
    expand?: {
        author?: UserModel;
        project?: ProjectModel;
        readBy?: UserModel[];
        topic?: TopicModel;
        replyTo?: MessageModel;
    }
} & RecordModel

export type TaskModel = {
    description: string; // max 500 chars
    done: boolean;
    project: string;
    deadline?: string;
    expand?: {
        project?: ProjectModel;
        topic?: TopicModel;
    }
} & RecordModel