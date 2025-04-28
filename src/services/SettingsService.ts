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