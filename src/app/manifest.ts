import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#ffffff",
    background_color: "#f5f5f5",
    icons: [
      {
        src: "app-icon/ios/192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "app-icon/ios/512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "app-icon/ios/192.png",
        sizes: "192x192",
        purpose: "maskable",
        type: "image/png",
      },
      {
        src: "app-icon/ios/512.png",
        sizes: "512x512",
        purpose: "maskable",
        type: "image/png",
      },
    ],
    orientation: "any",
    display: "standalone",
    dir: "auto",
    lang: "ko-KR",
    name: "PWA TODO",
    short_name: "PWA TODO",
    start_url: "/pwa-todo",
  };
}
