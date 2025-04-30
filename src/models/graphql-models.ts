export interface VideoSnap {
    id: string;
    feed: Feed;
    created: string;
    data: string;
}

export interface SnapComparison {
    id: number;
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

export interface CompareProfile {
    id: string;
    created: string;
    modified: string;
    name: string;
}

export interface PointOfInterest {
    id: string;
    created: string;
    modified: string;
    request: string;
    detected: boolean;
    compareProfile: CompareProfile;
    actions: POIAction[];
}

export interface POIAction {
    id: string;
    created: string;
    modified: string;
    action: string;
    compareProfile: CompareProfile;
}

export type SnapPair = [(VideoSnap | undefined)?, (VideoSnap | undefined)?];
