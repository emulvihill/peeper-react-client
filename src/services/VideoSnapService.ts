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

export const CREATE_AND_COMPARE_VIDEO_SNAP = gql`  mutation CreateAndCompareVideoSnap($input: VideoSnapInput!) {
    createAndCompareVideoSnap(input: $input) {
        current {
            id
            feed {
                id
            }
            data
        }
        previous{
            id
        }
        numPersons
        comparisons
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