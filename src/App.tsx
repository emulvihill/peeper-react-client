import {useState, useMemo} from 'react';
import SnapListView from './components/SnapListView/SnapListView';
import classes from './App.module.css';
import {SnapPair, VideoSnap} from "./models/graphql-models.ts";
import ComparisonOutput from "./components/ComparisonOutput/ComparisonOutput.tsx";
import {VideoCapturePanel} from "./components/VideoCapturePanel/VideoCapturePanel.tsx";

import {Container, Button, Title, Group, Stack} from '@mantine/core';

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
        <div className={classes.wrapper}>
            <Container fluid py="xl">
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

                    {pairDefined(comparisonPair) && (
                        <ComparisonOutput
                            snaps={comparisonPair}
                        />
                    )}
                </Stack>
            </Container>
        </div>
    )
};

export default App;