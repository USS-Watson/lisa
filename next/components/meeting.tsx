import { getData } from "@/lib/get-token";
import dynamic from "next/dynamic";

const Videocall = dynamic<{ slug: string; JWT: string }>(
    () => import("@/components/videocall"),
    { ssr: false },
);

export default async function Meeting({ params }: { params: { slug: string } }) {
    const jwt = await getData(params.slug);
    return (
        // <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Videocall slug={params.slug} JWT={jwt} />
    );
}