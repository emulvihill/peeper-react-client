import {useState, useMemo} from 'react';
import SnapListView from './components/SnapListView/SnapListView';
import {SnapPair, VideoSnap} from "./models/graphql-models.ts";
import {VideoCapturePanel} from "./components/VideoCapturePanel/VideoCapturePanel.tsx";

import {Container, Button, Title, Group, Stack, AppShell} from '@mantine/core';
import ComparisonsForFeed from "./components/ComparisonsForFeed/ComparisonsForFeed.tsx";

const App = () => {

    const pairDefined = (pair: SnapPair) => !!(pair[0] && pair[1])

    const [storage, setStorage] = useState<VideoSnap[]>([]);
    const [snapPair, setSnapPair] = useState<SnapPair>([undefined, undefined]);
    const [comparisonPair, setComparisonPair] = useState<SnapPair>([undefined, undefined]);
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
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'sm',
            }}
            padding="md"
        >
            <Container fluid py="xl">
                <Group align="start" wrap="nowrap">
                    <Stack align="center">
                        <Title order={1}>
                            Peeper
                        </Title>

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

                        <SnapListView
                            snaps={storage}
                            onEdit={setSnapPair}
                        />
                    </Stack>
                    <ComparisonsForFeed feedId={"1"}></ComparisonsForFeed>
                </Group>
            </Container>
        </AppShell>
    )
};

export default App;