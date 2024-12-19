import {useState, useMemo} from 'react';
import SnapListView from './components/SnapListView/SnapListView';
import './App.css';
import {SnapPair, VideoSnap} from "./models/graphql-models.ts";
import ComparisonOutput from "./components/ComparisonOutput/ComparisonOutput.tsx";
import {VideoCapturePanel} from "./components/VideoCapturePanel/VideoCapturePanel.tsx";

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

    const handleSnapCaptured = (snap:VideoSnap) => {
        setStorage(prev => [...prev, snap]);
    }

    return (
        <div>
            <h1>Peeper</h1>

            <VideoCapturePanel onSnapCapture={handleSnapCaptured}></VideoCapturePanel>

            <div>
                <button id="compare" hidden={storage.length < 2} disabled={!canCompare}
                        onClick={compareSelected}>Compare Images
                </button>
            </div>

            <SnapListView
                snaps={storage}
                onEdit={setSnapPair}
            />

            {pairDefined(comparisonPair) && <div>
                <ComparisonOutput
                    snaps={comparisonPair}
                />
            </div>}
        </div>
    )
};

export default App;