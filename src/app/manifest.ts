import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#ffffff",
    background_color: "#ffffff",
    icons: [
      {
        src: "app-icon/ios/16.png",
        sizes: "16x16",
      },
      {
        src: "app-icon/ios/20.png",
        sizes: "20x20",
      },
      {
        src: "app-icon/ios/29.png",
        sizes: "29x29",
      },
      {
        src: "app-icon/ios/32.png",
        sizes: "32x32",
      },
      {
        src: "app-icon/ios/40.png",
        sizes: "40x40",
      },
      {
        src: "app-icon/ios/50.png",
        sizes: "50x50",
      },
      {
        src: "app-icon/ios/57.png",
        sizes: "57x57",
      },
      {
        src: "app-icon/ios/58.png",
        sizes: "58x58",
      },
      {
        src: "app-icon/ios/60.png",
        sizes: "60x60",
      },
      {
        src: "app-icon/ios/64.png",
        sizes: "64x64",
      },
      {
        src: "app-icon/ios/72.png",
        sizes: "72x72",
      },
      {
        src: "app-icon/ios/76.png",
        sizes: "76x76",
      },
      {
        src: "app-icon/ios/80.png",
        sizes: "80x80",
      },
      {
        src: "app-icon/ios/87.png",
        sizes: "87x87",
      },
      {
        src: "app-icon/ios/100.png",
        sizes: "100x100",
      },
      {
        src: "app-icon/ios/114.png",
        sizes: "114x114",
      },
      {
        src: "app-icon/ios/120.png",
        sizes: "120x120",
      },
      {
        src: "app-icon/ios/128.png",
        sizes: "128x128",
      },
      {
        src: "app-icon/ios/144.png",
        sizes: "144x144",
      },
      {
        src: "app-icon/ios/152.png",
        sizes: "152x152",
      },
      {
        src: "app-icon/ios/167.png",
        sizes: "167x167",
      },
      {
        src: "app-icon/ios/180.png",
        sizes: "180x180",
      },
      {
        src: "app-icon/ios/192.png",
        sizes: "192x192",
      },
      {
        src: "app-icon/ios/256.png",
        sizes: "256x256",
      },
      {
        src: "app-icon/ios/512.png",
        sizes: "512x512",
        purpose: "maskable",
        type: "image/png",
      },
      {
        src: "app-icon/ios/1024.png",
        sizes: "1024x1024",
      },
    ],
    orientation: "any",
    display: "standalone",
    dir: "auto",
    lang: "ko-KR",
    name: "react-deep-dive",
    short_name: "react-deep-dive",
    start_url: "/",
  };
}
