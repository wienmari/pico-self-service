import { NextRequest } from "next/server";
import { connect, StringCodec, jwtAuthenticator } from "nats";

export async function GET(req: NextRequest) {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    try {
        const natsCreds = process.env.NATS_CREDS
        const nkey = process.env.NATS_NKEY

        if (!natsCreds || !nkey) {
            console.log("uhoh")
            return new Response("NATS credentials not found", { status: 500 });
        }
        const nkeyUint8Array = new TextEncoder().encode(nkey);

        // Velg autentiseringstype
        const auth = jwtAuthenticator(natsCreds, nkeyUint8Array)

        // Koble til Synadia NATS-server
        const nc = await connect({
            servers: process.env.NATS_URL || "nats://connect.ngs.global:4222",
            ...(auth ? { authenticator: auth } : {}),
        });

        const sc = StringCodec();
        const sub = nc.subscribe(process.env.NATS_SUBJECT || "livedata");

        writer.write(encoder.encode("data: Connected to SSE\n\n"));

        (async () => {
            for await (const msg of sub) {
                const data = sc.decode(msg.data);
                writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            }
        })();

        return new Response(readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        console.error("NATS connection error:", error);
        return new Response("NATS connection failed", { status: 500 });
    }
}
