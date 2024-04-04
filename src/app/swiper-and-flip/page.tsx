"use client";
import type { MouseEvent, TouchEvent, UIEvent } from "react";
import { useEffect, useRef, useState } from "react";

type SwipeStatus =
  | "AUTO TRANSITION"
  | "SWIPE right"
  | "SWIPE left"
  | "TO RIGHT"
  | "TO LEFT"
  | "CANCEL";

const GestureRecognizer = () => {
  const frontCardRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const intervalRef = useRef<number | null>(null); // intervalId를 저장하기 위한 ref

  const [width, setWidth] = useState(0);
  const [boundingX, setBoundingX] = useState<number>(0);
  const [initialX, setInitialX] = useState<number>(0);
  const [currentX, setCurrentX] = useState<number>(0);
  const [translateX, setTranslateX] = useState<number>(0);
  const [arr, setArr] = useState<string[]>(["red", "orange", "green", "blue"]);
  const [cardIndex, setCardIndex] = useState(0);
  const [description, setDescription] =
    useState<SwipeStatus>("AUTO TRANSITION");

  const [hovered, setHovered] = useState<boolean>(false); // 추가: 호버 상태 추적
  const [animation, setAnimation] = useState<Animation | null>(null);
  const [transitionOffset, setTransitionOffset] = useState(0);
  const [transitionOpacity, setTransitionOpacity] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (frontCardRef.current) {
        setWidth(frontCardRef.current.clientWidth);
        setBoundingX(frontCardRef.current?.getBoundingClientRect().left);
      }
    };

    // 컴포넌트가 마운트될 때 한 번 실행합니다.
    handleResize();

    // resize 이벤트를 감지해서 핸들러를 실행합니다.
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트될 때 cleanup 함수를 실행합니다.
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!frontCardRef.current) {
      return;
    }

    const keyFrameEffect = new KeyframeEffect(
      frontCardRef.current,
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
    setAnimation(animation);

    function changeCard() {
      if (isDraggingRef.current) {
        animation.cancel();
        return;
      }

      setDescription("AUTO TRANSITION");
      if (animation.playState !== "running") {
        animation.play();
      } else {
        setCardIndex((prev) => (prev + 1) % 4);
      }
    }

    intervalRef.current = window.setInterval(changeCard, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  function handleGestureStart(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    isDraggingRef.current = true;

    const xPoint = getGestureXPointFromEvent(event);
    setInitialX(xPoint);
  }

  function handleGestureMove(event: MouseEvent | TouchEvent) {
    event.preventDefault();

    const xPoint = getGestureXPointFromEvent(event);
    setCurrentX(xPoint);

    window.requestAnimationFrame(onAnimFrame);
  }

  function onAnimFrame() {
    if (!isDraggingRef.current) {
      return;
    }

    const differenceInX = currentX - initialX;
    setTranslateX(differenceInX);
    setTransitionOffset(currentX);
    setTransitionOpacity(1 - Math.abs(differenceInX) / width);
    setDescription(differenceInX > 0 ? "SWIPE right" : "SWIPE left");
  }

  function handleGestureEnd() {
    if (Math.abs(currentX - initialX) / width >= 0.5) {
      setCardIndex((prev) => (prev + 1) % 4);
      setDescription(currentX - initialX > 0 ? "TO RIGHT" : "TO LEFT");
    } else {
      setDescription("CANCEL");
    }

    setTranslateX(0);
    setTransitionOffset(0);
    setTransitionOpacity(1);
    isDraggingRef.current = false;
  }

  const handleMouseLeave = (event: MouseEvent) => {
    if (isDraggingRef.current) return;
    handleGestureEnd();
  };

  function getGestureXPointFromEvent(event: MouseEvent | TouchEvent) {
    let xPoint;

    if ("touches" in event && event.touches.length) {
      xPoint = event.touches[0].clientX;
    } else {
      xPoint = (event as MouseEvent).clientX;
    }

    return xPoint;
  }

  return (
    <div
      className="wrap-card"
      style={{
        margin: "auto",
        width: "60%",
        marginTop: 40,
        textAlign: "center",
      }}
    >
      <p className="description" style={{ width: "100%" }}>
        {description}
      </p>
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
            zIndex: 1,
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
          ref={frontCardRef}
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
            transform: `translateX(${translateX}px)`,
            opacity: transitionOpacity,
            zIndex: 2,
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
            touchAction: "none",
            cursor: isDraggingRef.current ? "grabbing" : "grab",
            zIndex: 3,
          }}
          onTouchStart={handleGestureStart}
          onTouchMove={handleGestureMove}
          onTouchEnd={handleGestureEnd}
          onMouseDown={handleGestureStart}
          onMouseMove={handleGestureMove}
          onMouseUp={handleGestureEnd}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    </div>
  );
};

export default GestureRecognizer;
