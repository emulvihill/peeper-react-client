import React, {useEffect, useState} from 'react';
import VideoSnapTile from '../VideoSnapTile/VideoSnapTile';
import classes from './SnapComparisonView.module.css';
import {VideoSnap} from "../../models/graphql-models.ts";

const SnapComparisonView: React.FC<{ snaps: VideoSnap[]; onEdit: (snaps: [VideoSnap?, VideoSnap?]) => void }> = ({ snaps, onEdit }) => {
    const [beforeSnap, setBeforeSnap] = useState<VideoSnap | undefined>();
    const [afterSnap, setAfterSnap] = useState<VideoSnap | undefined>();
    const [lastSelectedSnap, setLastSelectedSnap] = useState<VideoSnap | undefined>();

    useEffect(() => {
        console.log(beforeSnap?.id, afterSnap?.id, lastSelectedSnap?.id);
    }, [beforeSnap, afterSnap, lastSelectedSnap]);

    const handleSnapSelected = (snap: VideoSnap) => {
        if (beforeSnap === snap || afterSnap === snap) {
            return;
        }
        let before, after;
        if (lastSelectedSnap) {
            if (lastSelectedSnap?.id < snap.id) {
                before = lastSelectedSnap;
                after = snap;
            } else {
                before = snap;
                after = lastSelectedSnap;
            }
        } else {
            if (snap.id === snaps[0]?.id) {
                before = snap;
                after = undefined;
            } else {
                before = undefined;
                after = snap;
            }
        }

        setBeforeSnap(before);
        setAfterSnap(after);
        setLastSelectedSnap(snap);
        onEdit([before, after]);
    };

    return (
        <div className={`${classes.wrapper}`}>
            {snaps.map(snap => (
                <VideoSnapTile
                    key={snap.id}
                    snap={snap}
                    selectedAsBefore={beforeSnap === snap}
                    selectedAsAfter={afterSnap === snap}
                    lastSelected={lastSelectedSnap === snap}
                    onSelected={handleSnapSelected}
                />
            ))}
        </div>
    );
};

export default SnapComparisonView;