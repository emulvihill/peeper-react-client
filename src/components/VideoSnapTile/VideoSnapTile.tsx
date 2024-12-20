import classes from './VideoSnapTile.module.css';
import {VideoSnap} from "../../models/graphql-models.ts";
import {Image} from "@mantine/core";

interface VideoSnapTileProps {
    snap: VideoSnap,
    selectedAsBefore: boolean,
    selectedAsAfter: boolean,
    lastSelected: boolean,
    onSelected: (snap: VideoSnap) => void
}

const VideoSnapTile = (props: VideoSnapTileProps) => {
    const handleClick = () => {
        props.onSelected(props.snap);
    };

    return (
        <Image onClick={handleClick}
               className={`${classes.image} 
            ${props.selectedAsBefore && classes.before} 
            ${props.selectedAsAfter && classes.after}
            ${props.lastSelected && classes.last}`}
               src={props.snap.data} alt="snap"/>
    );
};

export default VideoSnapTile;