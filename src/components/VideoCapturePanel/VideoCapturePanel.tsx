import {VideoSnap} from "../../models/graphql-models.ts";
import {useRef, useState} from "react";
import {useMutation} from "@apollo/client";
import {CREATE_VIDEO_SNAP} from "../../services/VideoSnapService.ts";
import {Button, Checkbox, NumberInput, Stack, Group, Box} from "@mantine/core";

interface VideoCapturePanelProps {
    onSnapCapture: (snap: VideoSnap) => void
}

export const VideoCapturePanel = ({onSnapCapture}: VideoCapturePanelProps) => {

    const [createVideoSnap] = useMutation(CREATE_VIDEO_SNAP);

    const [hideVideo, setHideVideo] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [interval, setInterval] = useState(10);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const captureIntervalRef = useRef<number | undefined>(undefined);

    const getTimeoutInterval = () => {
        return (interval >= 1 ? interval : 1) * 1000;
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
        const ctx = canvas.getContext("2d");

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
                console.log("Created Snap: " + snap)
                onSnapCapture(snap);
            }
        };

        reader.readAsDataURL(blob);
        captureIntervalRef.current = setTimeout(createSnapshot, getTimeoutInterval());
    };

    return (
        <Stack align="center">
            <Group>
                <Button
                    onClick={startCapture}
                    disabled={capturing}
                    color="green"
                    variant="filled"
                >
                    Start
                </Button>
                <Button
                    onClick={stopCapture}
                    disabled={!capturing}
                    color="red"
                    variant="filled"
                >
                    Stop
                </Button>
                <Checkbox
                    label="Hide Video"
                    checked={hideVideo}
                    onChange={(event) => setHideVideo(event.currentTarget.checked)}
                />
            </Group>

            <Group>
                <NumberInput
                    label="Interval (seconds)"
                    description="Time between captures"
                    value={interval}
                    onChange={val => setInterval(Number(val) || 1)}
                    min={1}
                    max={60}
                    stepHoldDelay={500}
                    stepHoldInterval={100}
                />
            </Group>

            <Box display={hideVideo ? "none" : "block"}>
                <video
                    ref={videoRef}
                    autoPlay
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                    }}
                />
            </Box>
        </Stack>
    );
};