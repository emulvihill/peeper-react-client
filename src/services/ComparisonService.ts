import {gql} from "@apollo/client";

export const COMPARE_VIDEO_SNAPS = gql`
    query CompareVideoSnapsById($id1: ID!, $id2: ID!) {
        compareVideoSnapsById(id1: $id1, id2: $id2) {
            current {
                id
                feed {
                    id
                }
                date
                data
            }
            previous {
                id
                feed {
                    id
                }
                date
                data
            }
            comparison
        }
    }
`;

export const COMPARISONS_FOR_FEED = gql`  query GetComparisonsForFeed($feedId: ID!) {
    comparisonsForFeed(feedId: $feedId) {
        id
        feed {
            id
        }
        current {
            id
            data
        }
        previous {
            id
            data
        }
        comparison
    }
}`;