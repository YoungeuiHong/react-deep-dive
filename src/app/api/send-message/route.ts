import webPush, { PushSubscription } from "web-push";

export async function POST(req: Request) {
  const { pushSubscription, title, message } = await req.json();
  const subscription = JSON.parse(pushSubscription) as PushSubscription;
  const payload = JSON.stringify({ title, message });

  if (
    !process.env.VAPID_SUBJECT ||
    !process.env.VAPID_PUBLIC_KEY ||
    !process.env.VAPID_PRIVATE_KEY
  ) {
    console.error("VAPID key 정보가 없습니다.");
    return Response.error();
  }

  const options = {
    vapidDetails: {
      subject: process.env.VAPID_SUBJECT,
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
    },
    TTL: 60,
  };

  try {
    const response = await webPush.sendNotification(
      subscription,
      payload,
      options,
    );
    return Response.json(response);
  } catch (error) {
    console.error("notification error", error);
    return Response.error();
  }
}
