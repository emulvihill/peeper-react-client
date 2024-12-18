import classes from './VideoSnapTile.module.css';
import {VideoSnap} from "../../models/graphql-models.ts";

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
        <div
            className={`${classes.wrapper}`}
            onClick={handleClick}
        >
            <img className={`${classes.image} 
            ${props.selectedAsBefore ? classes.before : ''} 
            ${props.selectedAsAfter ? classes.after : ''}
            ${props.lastSelected ? classes.last : ''}`}
            src={props.snap.data} alt="snap"/>
        </div>
    );
};

export default VideoSnapTile;