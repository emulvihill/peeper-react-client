import {gql} from '@apollo/client';

export const CREATE_VIDEO_SNAP = gql`  mutation CreateVideoSnap($input: VideoSnapInput!) {
    createVideoSnap(input: $input) {
        id
        feed {
            id
        }
        data
    }
}`;

export const GET_VIDEO_SNAPS = gql`  query GetVideoSnaps {
    videoSnaps {
        id
        feed {
            id
        }
        data
    }
}`;

export const GET_VIDEO_SNAPS_FOR_FEED = gql`  query GetVideoSnaps($feedId: ID!) {
    videoSnapsForFeed(feedId: $feedId) {
        id
        feed {
            id
        }
        data
    }
}`;

export const REMOVE_VIDEO_SNAP = gql`  mutation RemoveVideoSnap($id: ID!) {
    deleteVideoSnap(id: $id)
}`;