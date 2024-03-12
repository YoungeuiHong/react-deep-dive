import webPush, { PushSubscription } from "web-push";

export async function POST(req: Request) {
  const { pushSubscription, title, message, delay = 3 } = await req.json();
  const subscription = JSON.parse(pushSubscription) as PushSubscription;
  const payload = JSON.stringify({ title, message });

  const options = {
    vapidDetails: {
      subject: "mailto:example_email@example.com",
      publicKey:
        process.env.VAPID_PUBLIC_KEY ??
        "BCwcX6sPcH0vuFZ97UAvziamP9qMo0qV2c5uns_YwHTp6XQKXdFDTgH9fD3hBr9oQVmO4kh7oS7HZyg-czft0Pc",
      privateKey:
        process.env.VAPID_PRIVATE_KEY ??
        "YFZJr1aOS3OjGhY1a_7bxaRUIvw5azZCd2VcgEKNwOM",
    },
    TTL: 60,
  };

  try {
    const response = await webPush.sendNotification(
      subscription,
      payload,
      options,
    );
    console.log("notification sent", response);
    return Response.json(response);
  } catch (error) {
    console.log("notification error", error);
    return Response.error();
  }
}
