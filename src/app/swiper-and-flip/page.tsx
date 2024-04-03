"use client";
import { useEffect, useRef, useState } from "react";

type SwipeStatus =
  | "AUTO TRANSITION"
  | "SWIPE right"
  | "SWIPE left"
  | "TO RIGHT"
  | "TO LEFT"
  | "CANCEL";

const GestureRecognizer = () => {
  const animationRef = useRef<HTMLDivElement | null>(null);

  const [translateX, setTranslateX] = useState<number>(0);
  const [arr, setArr] = useState<string[]>(["red", "orange", "green", "blue"]);
  const [cardIndex, setCardIndex] = useState(0);
  const [description, setDescription] =
    useState<SwipeStatus>("AUTO TRANSITION");

  useEffect(() => {
    if (!animationRef.current) {
      return;
    }

    // const keyframes: Keyframe[] | PropertyIndexedKeyframes = [
    //   { opacity: 1, transform: "translateX(0%)", offset: 0 },
    //   { opacity: 0, transform: "translateX(100%)", offset: 1 },
    // ];

    const keyFrameEffect = new KeyframeEffect(
      animationRef.current,
      [
        { transform: "translateX(0%)", opacity: 1, offset: 0 },
        { transform: "translateX(100%)", opacity: 0, offset: 0.1 },
        { transform: "translateX(100%)", opacity: 0, offset: 1 },
      ],
      {
        duration: 3000,
        fill: "forwards",
        easing: "linear",
        iterations: Infinity,
      },
    );

    let animation: Animation = new Animation(keyFrameEffect);

    function playAnimation() {
      animation.play();
    }

    function changeCard() {
      setCardIndex((prev) => (prev + 1) % 4);
      playAnimation();
    }

    playAnimation();

    const intervalId = window.setInterval(changeCard, 3000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <div
      className="wrap-card"
      style={{
        margin: "auto",
        width: "30%",
        marginTop: 40,
        textAlign: "center",
      }}
    >
      <h3 className="description">{description}</h3>
      <div
        className="card-wrapper"
        style={{ width: "100%", height: "60px", position: "relative" }}
      >
        <div
          className="card"
          style={{
            display: "flex",
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: `${arr[(cardIndex + 1) % 4]}`,
            textAlign: "center",
            alignItems: "center",
            fontWeight: "bold",
            color: "white",
            borderRadius: "4px",
            touchAction: "none",
          }}
        >
          <div
            className="card-inner"
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {arr[(cardIndex + 1) % 4]}
          </div>
        </div>
        <div
          className="card"
          ref={animationRef}
          style={{
            display: "flex",
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: `${arr[cardIndex]}`,
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            alignItems: "center",
            borderRadius: "4px",
            touchAction: "none",
          }}
        >
          <div
            className="card-inner"
            style={{ textAlign: "center", display: "block", width: "100%" }}
          >
            {arr[cardIndex]}
          </div>
        </div>
        <div
          className="gesture-recognizer"
          style={{
            display: "block",
            position: "absolute",
            left: translateX,
            width: "100%",
            height: "100%",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default GestureRecognizer;
