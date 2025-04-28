import {useMemo, useState} from 'react';
import SnapListView from './components/SnapListView/SnapListView';
import {SnapPair, VideoSnap} from "./models/graphql-models.ts";
import {VideoCapturePanel} from "./components/VideoCapturePanel/VideoCapturePanel.tsx";

import {AppShell, Button, Group, Modal, ScrollArea, Stack, Title} from '@mantine/core';
import ComparisonsForFeed from "./components/ComparisonsForFeed/ComparisonsForFeed.tsx";
import ComparisonOutput from "./components/ComparisonOutput/ComparisonOutput.tsx";
import Settings from "./components/Settings/Settings.tsx";

const App = () => {

    const pairDefined = (pair: SnapPair) => !!(pair[0] && pair[1])

    const [storage, setStorage] = useState<VideoSnap[]>([]);
    const [snapPair, setSnapPair] = useState<SnapPair>([undefined, undefined]);
    const [comparisonPair, setComparisonPair] = useState<SnapPair>([undefined, undefined]);
    const [settingsOpened, setSettingsOpened] = useState(false);
    const canCompare = useMemo(() => pairDefined(snapPair), [snapPair]);

    const compareSelected = () => {
        if (canCompare) {
            setComparisonPair(snapPair);
        }
    }

    const handleSnapCaptured = (snap: VideoSnap) => {
        setStorage(prev => [...prev, snap]);
    }

    return (
        <>
            <AppShell
                header={{height: 60}}
                /*            navbar={{
                                width: 300,
                                breakpoint: 'sm',
                            }}*/
                padding="md"
            >
                <AppShell.Header>
                    <Group justify="space-between" px="md">
                        <Title order={1}>
                            Peeper 👁️👁️
                        </Title>
                        <Button
                            variant="subtle"
                            onClick={() => setSettingsOpened(true)}
                        >
                            Settings
                        </Button>
                    </Group>
                </AppShell.Header>
                <AppShell.Main>
                    <Group align="start" wrap="nowrap">
                        <Stack align="center">
                            <VideoCapturePanel onSnapCapture={handleSnapCaptured}/>

                            <Group justify="center">
                                {storage.length >= 2 && (
                                    <Button
                                        color="blue"
                                        disabled={!canCompare}
                                        onClick={compareSelected}
                                        size="lg"
                                    >
                                        Compare Images
                                    </Button>
                                )}
                            </Group>

                            {pairDefined(comparisonPair) && (
                                <ComparisonOutput snaps={comparisonPair}/>
                            )}

                            <SnapListView
                                snaps={storage}
                                onEdit={setSnapPair}
                            />
                        </Stack>
                        <ScrollArea h="calc(100vh - 100px)">
                            <ComparisonsForFeed feedId={"1"}></ComparisonsForFeed>
                        </ScrollArea>
                    </Group>
                </AppShell.Main>
                {/*<AppShell.Footer></AppShell.Footer>*/}
            </AppShell>

            <Modal
                opened={settingsOpened}
                onClose={() => setSettingsOpened(false)}
                title="Settings"
                size="lg"
            >
                <Settings onClose={() => setSettingsOpened(false)}/>
            </Modal>
        </>
    )
};

export default App;
