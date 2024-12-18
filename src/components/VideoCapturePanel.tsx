import {VideoSnap} from "../models/graphql-models.ts";
import {useRef, useState} from "react";
import {useMutation} from "@apollo/client";
import {CREATE_VIDEO_SNAP} from "../services/VideoSnapService.ts";

interface VideoCapturePanelProps {
    onSnapCapture: (snap: VideoSnap) => void
}

export const VideoCapturePanel = ({onSnapCapture}: VideoCapturePanelProps) => {

    const [createVideoSnap] = useMutation(CREATE_VIDEO_SNAP);

    const [hideVideo, setHideVideo] = useState(false);
    const [capturing, setCapturing] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const captureIntervalRef = useRef<number | undefined>(undefined);
    const intervalInputRef = useRef<HTMLInputElement | null>(null);

    const getTimeoutInterval = () => {
        const intervalValue = parseInt(intervalInputRef.current?.value || '5');
        return (intervalValue >= 1 ? intervalValue : 1) * 1000;
    };

    const startCapture = async () => {
        setCapturing(true);
        streamRef.current = await navigator.mediaDevices.getUserMedia({video: true});
        videoRef.current!.srcObject = streamRef.current;

        if (captureIntervalRef.current !== undefined) {
            clearInterval(captureIntervalRef.current);
        }
        captureIntervalRef.current = setTimeout(createSnapshot, getTimeoutInterval());
    };

    const stopCapture = () => {
        clearInterval(captureIntervalRef.current);
        setCapturing(false);

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const createSnapshot = async () => {
        const canvas = new OffscreenCanvas(1, 1);
        const ctx = canvas.getContext('2d');

        if (!ctx || !videoRef.current) return;

        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;

        const maxDimension = 128;
        const reduction = Math.max(canvas.width, canvas.height) / maxDimension;
        const dw = Math.floor(canvas.width / reduction);
        const dh = Math.floor(canvas.height / reduction);

        canvas.width = dw;
        canvas.height = dh;
        ctx.drawImage(videoRef.current, 0, 0, dw, dh);

        const blob = await canvas.convertToBlob();
        const reader = new FileReader();

        reader.onloadend = async () => {
            if (reader.result) {
                const {data} = await createVideoSnap({
                    variables: {
                        input: {
                            feedId: "1",
                            data: reader.result.toString()
                        }
                    }
                });
                const snap = data.createVideoSnap as VideoSnap;
                onSnapCapture(snap);
            }
        };

        reader.readAsDataURL(blob);
        captureIntervalRef.current = setTimeout(createSnapshot, getTimeoutInterval());
    };

    return (
        <>
            <div>
                <button onClick={startCapture} disabled={capturing}>Start</button>
                <button onClick={stopCapture} disabled={!capturing}>Stop</button>
                <input
                    type="checkbox"
                    checked={hideVideo}
                    onChange={e => setHideVideo(e.target.checked)}
                    id="hideVid"
                />
                <label htmlFor="hideVid">Hide Video</label>
            </div>
            <div>
                <label htmlFor="interval">Interval: </label>
                <input
                    style={{width: '50px'}}
                    type="number"
                    ref={intervalInputRef}
                    defaultValue={1}
                    id="interval"
                />
            </div>
            <div>
                <video
                    ref={videoRef}
                    autoPlay
                    hidden={hideVideo}
                    style={{width: '100%', maxWidth: '640px'}}
                />
            </div>
        </>
    );
};