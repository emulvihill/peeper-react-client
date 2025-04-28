import { FC, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_COMPARE_PROFILES, GET_POINTS_OF_INTEREST_FOR_PROFILE } from "../../services/SettingsService";
import { CompareProfile, PointOfInterest } from "../../models/graphql-models";
import { Loading } from "../Loading/Loading";
import { 
    Select, 
    Paper, 
    Title, 
    Text, 
    Stack, 
    Group, 
    Badge, 
    Card, 
    ScrollArea,
    Divider,
    Button,
    Box
} from "@mantine/core";

interface SettingsProps {
    onClose?: () => void;
}

interface CompareProfilesData {
    compareProfiles: CompareProfile[];
}

interface PointsOfInterestData {
    pointsOfInterestForProfile: PointOfInterest[];
}

interface PointsOfInterestVariables {
    profileId: string;
}

export const Settings: FC<SettingsProps> = ({ onClose }) => {
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);

    // Fetch compare profiles
    const { 
        data: profilesData, 
        loading: profilesLoading, 
        error: profilesError 
    } = useQuery<CompareProfilesData>(GET_COMPARE_PROFILES);

    // Fetch points of interest for the selected profile
    const {
        data: poiData,
        loading: poiLoading,
        error: poiError
    } = useQuery<PointsOfInterestData, PointsOfInterestVariables>(
        GET_POINTS_OF_INTEREST_FOR_PROFILE,
        {
            variables: { profileId: selectedProfileId || "" },
            skip: !selectedProfileId
        }
    );

    // Set the first profile as selected when profiles are loaded
    useEffect(() => {
        if (profilesData && profilesData?.compareProfiles?.length > 0 && !selectedProfileId) {
            setSelectedProfileId(profilesData.compareProfiles[0].id);
        }
    }, [profilesData, selectedProfileId]);

    // Handle POI click
    const handlePOIClick = (poi: PointOfInterest) => {
        setSelectedPOI(poi.id === selectedPOI?.id ? null : poi);
    };

    if (profilesLoading) return <Loading />;
    if (profilesError) return <Text c="red">Error loading profiles: {profilesError.message}</Text>;

    const profiles = profilesData?.compareProfiles || [];
    const pointsOfInterest = poiData?.pointsOfInterestForProfile || [];

    return (
        <Paper p="md" shadow="sm" radius="md" withBorder>
            <Stack>
                <Title order={2}>Settings</Title>
                <Divider />

                <Text fw={500}>Compare Profile</Text>
                <Select
                    data={profiles.map(profile => ({ value: profile.id, label: profile.name }))}
                    value={selectedProfileId}
                    onChange={setSelectedProfileId}
                    placeholder="Select a profile"
                    searchable
                    clearable={false}
                />

                <Text fw={500} mt="md">Points of Interest</Text>
                {poiLoading ? (
                    <Loading />
                ) : poiError ? (
                    <Text c="red">Error loading points of interest: {poiError.message}</Text>
                ) : (
                    <ScrollArea h={300}>
                        <Stack>
                            {pointsOfInterest.length === 0 ? (
                                <Text c="dimmed">No points of interest found for this profile.</Text>
                            ) : (
                                pointsOfInterest.map(poi => (
                                    <Card 
                                        key={poi.id} 
                                        shadow="sm" 
                                        padding="sm" 
                                        radius="md" 
                                        withBorder
                                        onClick={() => handlePOIClick(poi)}
                                        style={{ 
                                            cursor: 'pointer',
                                            backgroundColor: selectedPOI?.id === poi.id ? '#f0f9ff' : undefined
                                        }}
                                    >
                                        <Group justify="space-between">
                                            <Text>{poi.request}</Text>
                                            <Badge color={poi.detected ? "green" : "gray"}>
                                                {poi.detected ? "Detected" : "Not Detected"}
                                            </Badge>
                                        </Group>

                                        {selectedPOI?.id === poi.id && poi.actions.length > 0 && (
                                            <Box mt="md">
                                                <Text size="sm" fw={500} c="dimmed">Actions:</Text>
                                                <Stack mt="xs">
                                                    {poi.actions.map(action => (
                                                        <Text key={action.id} size="sm">{action.action}</Text>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        )}
                                    </Card>
                                ))
                            )}
                        </Stack>
                    </ScrollArea>
                )}

                <Group justify="flex-end" mt="md">
                    <Button onClick={onClose}>Close</Button>
                </Group>
            </Stack>
        </Paper>
    );
};

export default Settings;
