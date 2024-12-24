export interface VideoSnap {
    id: string;
    feed: Feed;
    date: string;
    data: string;
}

export interface SnapComparison {
    current: VideoSnap;
    previous?: VideoSnap;
    comparisons: string[];
    numPersons: number;
}

export interface VideoSnapInput {
    feedId: string;
    data: string;
}

export interface Feed {
    id: string;
    userId: number;
    name: string;
}

export interface FeedInput {
    userId: number;
    name: string;
}

export type SnapPair = [(VideoSnap | undefined)?, (VideoSnap | undefined)?];