"use client";
import type { MouseEvent } from "react";
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
  const [startX, setStartX] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(400);
  const [transitionOffset, setTransitionOffset] = useState(0);
  const [transitionOpacity, setTransitionOpacity] = useState(1);
  const [animation, setAnimation] = useState<Animation | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    if (!animationRef.current) {
      return;
    }

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

    const animation = new Animation(keyFrameEffect);

    setAnimation(animation);

    function playAnimation() {
      if (!animation) return;
      animation.play();
    }

    function changeCard() {
      playAnimation();
      setCardIndex((prev) => (prev + 1) % 4);
    }

    playAnimation();
    const id = window.setInterval(changeCard, 3000);
    setIntervalId(id);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (animation) {
        animation.cancel();
      }
    };
  }, []);

  // useEffect(() => {
  //   if (dragging) {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //     if (animation) {
  //       animation.pause();
  //     }
  //   }
  // }, [dragging]);

  function handleMouseDown(event: MouseEvent) {
    event.preventDefault();
    setDragging(true);
    setStartX(event.clientX);
    setWidth(event.currentTarget.clientWidth);
    setTranslateX(0);
  }

  function handleMouseMove(event: MouseEvent) {
    event.preventDefault();

    if (!dragging) {
      return;
    }

    const currentX = event.clientX;
    const deltaX = currentX - startX;
    setDescription(deltaX < 0 ? "SWIPE left" : "SWIPE right");
    const offset = (deltaX * 100) / width;
    setTranslateX(deltaX);
    setTransitionOffset(offset);
    if (animationRef.current) {
      animationRef.current.style.transform = `translateX(${transitionOffset}%)`;
      animationRef.current.style.opacity = `${1 - Math.abs(deltaX) / width}`;
      animationRef.current.style.transition = "all 0.3s ease-in-out";
    }
  }

  function performTransition() {
    setTransitionOffset(100);
    setTransitionOpacity(0);
    setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % 4);
      setTransitionOffset(0);
    }, 300);
  }

  function handleMouseUp(event: MouseEvent) {
    event.preventDefault();
    setDragging(false);
    const deltaX = translateX - startX;
    if (Math.abs(deltaX) / width >= 0.5) {
      if (deltaX < 0) {
        setDescription("TO LEFT");
      } else {
        setDescription("TO RIGHT");
      }
      // performTransition();
      setCardIndex((prev) => (prev + 1) % 4);
    } else {
      setDescription("CANCEL");
    }
    setTranslateX(0);
    setTransitionOffset(0);
    setTransitionOpacity(1);
  }

  const handleMouseLeave = (event: MouseEvent) => {
    event.preventDefault();
    if (!dragging) return;

    // setDragging(false);
    setTranslateX(0);
    // setTransitionOffset(0);
    // setTransitionOpacity(1);
  };

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
            fontWeight: 900,
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
            fontWeight: 900,
            color: "white",
            alignItems: "center",
            borderRadius: "4px",
            touchAction: "none",
            transition: dragging ? "all 0.3s ease-in-out" : undefined,
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
            cursor: dragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    </div>
  );
};

export default GestureRecognizer;
