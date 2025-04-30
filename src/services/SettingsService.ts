import {gql} from "@apollo/client";

export const GET_COMPARE_PROFILES = gql`
    query GetCompareProfiles {
        compareProfiles {
            id
            name
            created
            modified
        }
    }
`;

export const GET_POINTS_OF_INTEREST_FOR_PROFILE = gql`
    query GetPointsOfInterestForProfile($profileId: ID!) {
        pointsOfInterestForProfile(profileId: $profileId) {
            id
            request
            detected
            created
            modified
            compareProfile {
                id
                name
            }
            actions {
                id
                action
                created
                modified
            }
        }
    }
`;

export const CREATE_POINT_OF_INTEREST = gql`
    mutation CreatePointOfInterest($profileId: ID!, $request: String!) {
        createPointOfInterest(profileId: $profileId, request: $request) {
            id
            request
            detected
            compareProfile {
                id
                name
            }
            actions {
                id
                action
            }
        }
    }
`;

export const DELETE_POINT_OF_INTEREST = gql`
    mutation DeletePointOfInterest($id: ID!) {
        deletePointOfInterest(id: $id)
    }
`;

export const CREATE_POI_ACTION = gql`
    mutation CreatePOIAction($poiId: ID!, $action: String!) {
        createPOIAction(poiId: $poiId, action: $action) {
            id
            action
            compareProfile {
                id
                name
            }
        }
    }
`;

export const DELETE_POI_ACTION = gql`
    mutation DeletePOIAction($id: ID!) {
        deletePOIAction(id: $id)
    }
`;
