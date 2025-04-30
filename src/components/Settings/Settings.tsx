import {FC, useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {
    CREATE_POI_ACTION,
    CREATE_POINT_OF_INTEREST,
    DELETE_POI_ACTION,
    DELETE_POINT_OF_INTEREST,
    GET_COMPARE_PROFILES,
    GET_POINTS_OF_INTEREST_FOR_PROFILE
} from "../../services/SettingsService";
import {CompareProfile, PointOfInterest} from "../../models/graphql-models";
import {Loading} from "../Loading/Loading";
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Group,
    Paper,
    ScrollArea,
    Select,
    Stack,
    Text,
    Title
} from "@mantine/core";
import {IconPlus, IconX} from '@tabler/icons-react';

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

export const Settings: FC<SettingsProps> = ({onClose}) => {
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);

    const {
        data: profilesData,
        loading: profilesLoading,
        error: profilesError
    } = useQuery<CompareProfilesData>(GET_COMPARE_PROFILES);

    const {
        data: poiData,
        loading: poiLoading,
        error: poiError,
        refetch: refetchPOIs
    } = useQuery<PointsOfInterestData, PointsOfInterestVariables>(
        GET_POINTS_OF_INTEREST_FOR_PROFILE,
        {
            variables: {profileId: selectedProfileId || ""},
            skip: !selectedProfileId,
            notifyOnNetworkStatusChange: true, // Useful for refetching status
        }
    );

    // --- Mutation Hooks ---
    const [createPOI] = useMutation(CREATE_POINT_OF_INTEREST, {
        onCompleted: () => refetchPOIs(), // Refetch POIs after creation
    });
    const [deletePOI] = useMutation(DELETE_POINT_OF_INTEREST, {
        onCompleted: () => {
            setSelectedPOI(null); // Deselect if deleted
            refetchPOIs();
        }
    });
    const [createAction] = useMutation(CREATE_POI_ACTION, {
        onCompleted: () => refetchPOIs(), // Refetch POIs to update actions list
    });
    const [deleteAction] = useMutation(DELETE_POI_ACTION, {
        onCompleted: () => refetchPOIs(), // Refetch POIs to update actions list
    });
    // --- End Mutation Hooks ---

    // Set the first profile as selected when profiles are loaded
    useEffect(() => {
        if (profilesData && profilesData?.compareProfiles?.length > 0 && !selectedProfileId) {
            setSelectedProfileId(profilesData.compareProfiles[0].id);
        }
    }, [profilesData, selectedProfileId]);

    const handlePOIClick = (poi: PointOfInterest) => {
        setSelectedPOI(poi.id === selectedPOI?.id ? null : poi);
    };


    // --- Action Handlers ---
    const handleAddPOI = () => {
        if (!selectedProfileId) return;
        const request = prompt("Enter the request for the new Point of Interest:");
        if (request) {
            createPOI({variables: {profileId: selectedProfileId, request}});
        }
    };

    const handleDeletePOI = (poiId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent Card onClick from firing
        if (window.confirm("Are you sure you want to delete this Point of Interest?")) {
            deletePOI({variables: {id: poiId}});
        }
    };

    const handleAddPOIAction = () => {
        if (!selectedPOI) return;
        const action = prompt("Enter the action for the selected Point of Interest:");
        if (action) {
            createAction({variables: {poiId: selectedPOI.id, action}});
        }
    };

    const handleDeletePOIAction = (actionId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (window.confirm("Are you sure you want to delete this Action?")) {
            deleteAction({variables: {id: actionId}});
        }
    };
    // --- End Action Handlers ---


    if (profilesLoading) return <Loading/>;
    if (profilesError) return <Text c="red">Error loading profiles: {profilesError.message}</Text>;

    const profiles = profilesData?.compareProfiles || [];
    const pointsOfInterest = poiData?.pointsOfInterestForProfile || [];

    return (
        <Paper p="md" shadow="sm" radius="md" withBorder>
            <Stack>
                <Title order={2}>Settings</Title>
                <Divider/>

                <Text fw={500}>Compare Profile</Text>
                <Select
                    data={profiles.map(profile => ({value: profile.id, label: profile.name}))}
                    value={selectedProfileId}
                    onChange={(value) => {
                        setSelectedProfileId(value);
                        setSelectedPOI(null); // Deselect POI when profile changes
                    }}
                    placeholder="Select a profile"
                    searchable
                    clearable={false}
                    disabled={poiLoading} // Disable while POIs are loading
                />

                <Group justify="space-between" align="center" mt="md">
                    <Text fw={500}>Points of Interest</Text>
                    <Button
                        leftSection={<IconPlus size={14}/>}
                        variant="light"
                        size="xs"
                        onClick={handleAddPOI}
                        disabled={!selectedProfileId || poiLoading} // Disable if no profile or loading
                    >
                        Add POI
                    </Button>
                </Group>

                {poiLoading ? (
                    <Loading/>
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
                                            backgroundColor: selectedPOI?.id === poi.id ? 'var(--mantine-color-blue-light-hover)' : undefined,
                                            border: selectedPOI?.id === poi.id ? `1px solid var(--mantine-color-blue-filled)` : undefined,
                                        }}
                                    >
                                        <Group justify="space-between" wrap="nowrap">
                                            <Stack gap={0} style={{flexGrow: 1}}>
                                                <Text>{poi.request}</Text>
                                                <Badge size="xs" w="fit-content"
                                                       color={poi.detected ? "green" : "gray"}>
                                                    {poi.detected ? "Detected" : "Not Detected"}
                                                </Badge>
                                            </Stack>
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                size="sm"
                                                onClick={(e) => handleDeletePOI(poi.id, e)}
                                                aria-label={`Delete Point of Interest: ${poi.request}`}
                                            >
                                                <IconX size={16}/>
                                            </ActionIcon>
                                        </Group>

                                        {selectedPOI?.id === poi.id && (
                                            <Box mt="md">
                                                <Group justify="space-between" align="center" mb="xs">
                                                    <Text size="sm" fw={500} c="dimmed">Actions:</Text>
                                                    <Button
                                                        leftSection={<IconPlus size={14}/>}
                                                        variant="light"
                                                        size="xs"
                                                        onClick={handleAddPOIAction}
                                                    >
                                                        Add Action
                                                    </Button>
                                                </Group>
                                                <Stack gap="xs" mt="xs">
                                                    {poi.actions.length === 0 ? (
                                                        <Text size="sm" c="dimmed">No actions defined.</Text>
                                                    ) : (
                                                        poi.actions.map(action => (
                                                            <Group key={action.id} justify="space-between"
                                                                   wrap="nowrap">
                                                                <Text size="sm"
                                                                      style={{flexGrow: 1}}>{action.action}</Text>
                                                                <ActionIcon
                                                                    variant="subtle"
                                                                    color="red"
                                                                    size="sm"
                                                                    onClick={(e) => handleDeletePOIAction(action.id, e)}
                                                                    aria-label={`Delete Action: ${action.action}`}
                                                                >
                                                                    <IconX size={14}/>
                                                                </ActionIcon>
                                                            </Group>
                                                        ))
                                                    )}
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
                    <Button onClick={onClose} variant="default">Close</Button>
                </Group>
            </Stack>
        </Paper>
    );
};

export default Settings;
