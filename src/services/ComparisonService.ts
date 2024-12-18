import {gql} from "@apollo/client";

export const COMPARE_VIDEO_SNAPS = gql`
    query CompareVideoSnapsById($id1: ID!, $id2: ID!) {
        compareVideoSnapsById(id1: $id1, id2: $id2)
    }
`;
