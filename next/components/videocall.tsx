"use client";

import { CSSProperties, useRef, useState } from "react";
import ZoomVideo, {
    type VideoClient,
    VideoQuality,
    type VideoPlayer,
} from "@zoom/videosdk";
import { CameraButton, MicButton } from "./mute-buttons";
import { PhoneOff } from "lucide-react";
import { Button } from "./ui/button";
import clsx from "clsx";
import Script from "next/script";

const Videocall = (props: { slug: string; JWT: string }) => {
    const session = props.slug;
    const jwt = props.JWT;
    const [inSession, setInSession] = useState(false);
    const client = useRef<typeof VideoClient>(ZoomVideo.createClient());
    const [isVideoMuted, setIsVideoMuted] = useState(
        !client.current.getCurrentUserInfo()?.bVideoOn
    );
    const [isAudioMuted, setIsAudioMuted] = useState(
        client.current.getCurrentUserInfo()?.muted ?? true
    );
    const videoContainerRef = useRef<HTMLDivElement>(null);

    const joinSession = async () => {
        await client.current.init("en-US", "Global", { patchJsMedia: true, enforceMultipleVideos:true });
        client.current.on(
            "peer-video-state-change",
            (payload) => void renderVideo(payload)
        );
        await client.current.join(session, jwt, userName).catch((e) => {
            console.log(e);
        });
        const mediaStream = client.current.getMediaStream();
        await mediaStream.startAudio();
        await mediaStream.startVideo();
        await renderVideo({
            action: "Start",
            userId: client.current.getCurrentUserInfo().userId,
        });
        setInSession(true);
        setIsVideoMuted(!mediaStream.isCapturingVideo());
        setIsAudioMuted(mediaStream.isAudioMuted());
    };

    const renderVideo = async (event: {
        action: "Start" | "Stop";
        userId: number;
    }) => {
        const mediaStream = client.current.getMediaStream();
        if (event.action === "Stop") {
            const element = await mediaStream.detachVideo(event.userId);
            Array.isArray(element) ? element.forEach((el) => el.remove()) : element.remove();
        } else {
            const userVideo = await mediaStream.attachVideo(
                event.userId,
                VideoQuality.Video_360P
            );
            videoContainerRef.current!.appendChild(userVideo as VideoPlayer);
        }
    };

    const leaveSession = async () => {
        client.current.off(
            "peer-video-state-change",
            (payload: { action: "Start" | "Stop"; userId: number }) =>
                void renderVideo(payload)
        );
        await client.current.leave().catch((e) => console.log("leave error", e));
        // hard refresh to clear the state
        window.location.href = "/";
    };

    return (
        <main className={clsx("bg-white rounded-lg shadow-lg flex flex-col items-center justify-between p-12", {
            'w-[60%] h-70vh]': inSession,
            'w-[20%] h-30vh]': !inSession
        })}>
            <div className="flex h-full w-full flex-1 flex-col">
                <div
                    className="flex w-full flex-1"
                    style={inSession ? {} : { display: "none" }}
                >
                    {/* @ts-expect-error html component */}
                    <video-player-container ref={videoContainerRef} style={videoPlayerStyle} />
                </div>
                {!inSession ? (
                    <div className="mx-auto flex w-64 flex-col self-center">
                        <div className="w-4" />
                        <Button className="flex flex-1 text-2xl" onClick={joinSession} title="join session">
                            Join
                        </Button>
                    </div>
                ) : (
                    <div className="flex w-full flex-col justify-around self-center">
                        <div className="mt-4 flex w-[30rem] flex-1 justify-around self-center rounded-md bg-white p-4">
                            <CameraButton
                                client={client}
                                isVideoMuted={isVideoMuted}
                                setIsVideoMuted={setIsVideoMuted}
                                renderVideo={renderVideo}
                            />
                            <MicButton
                                isAudioMuted={isAudioMuted}
                                client={client}
                                setIsAudioMuted={setIsAudioMuted}
                            />
                            <Button onClick={leaveSession} title="leave session">
                                <PhoneOff />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />
        </main>
    );
};

export default Videocall;

const videoPlayerStyle = {
    height: "75vh",
    marginTop: "1.5rem",
    marginLeft: "3rem",
    marginRight: "3rem",
    alignContent: "center",
    borderRadius: "10px",
    overflow: "hidden",
} as CSSProperties;

const userName = `User-${new Date().getTime().toString().slice(8)}`;