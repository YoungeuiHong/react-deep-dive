"use client";
import { useEffect, useRef, useState } from "react";
import type { TouchEvent, MouseEvent } from "react";
import styles from "./GestureRecognizer.module.css";

type SwipeStatus =
  | "AUTO TRANSITION"
  | "SWIPE right"
  | "SWIPE left"
  | "TO RIGHT"
  | "TO LEFT"
  | "CANCEL";

const GestureRecognizer = () => {
  const swipeRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const startTranslateXRef = useRef<number>(0);
  const startTimestampRef = useRef<number>(0);
  const dragRef = useRef<boolean>(false);

  const [dragging, setDragging] = useState(false);
  const [translateX, setTranslateX] = useState<number>(0);
  const [currentWidth, setCurrentWidth] = useState<number>(400);
  const [arr, setArr] = useState<string[]>(["red", "orange", "green", "blue"]);
  const [cardIndex, setCardIndex] = useState(0);
  const [description, setDescription] =
    useState<SwipeStatus>("AUTO TRANSITION");
  const [transitionOffset, setTransitionOffset] = useState(0);
  const [transitionOpacity, setTransitionOpacity] = useState(1);

  // useEffect(() => {
  //   const autoTransition = () => {
  //     setDescription("AUTO TRANSITION");
  //     setTransitionOpacity(1);
  //     performTransition();
  //   };
  //
  //   let intervalId: number | undefined;
  //
  //   if (!dragging) {
  //     intervalId = window.setInterval(autoTransition, 3000);
  //   }
  //
  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, [dragging]);

  const performTransition = () => {
    setTransitionOffset(100);
    setTransitionOpacity(0);
    setTimeout(() => {
      indexRef.current = (cardIndex + 1) % 4;
      setCardIndex((prev) => (prev + 1) % 4);
      setTransitionOffset(0);
    }, 300);
  };

  const handleTouchStart = (event: TouchEvent) => {
    setDragging(true);
    dragRef.current = true;
    setCurrentWidth(event.currentTarget.clientWidth);
    startXRef.current = event.touches[0].clientX;
    startTranslateXRef.current = translateX;
    startTimestampRef.current = Date.now();
    if (swipeRef?.current?.style?.transition) {
      swipeRef.current.style.transition = "initial";
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (dragging) {
      const deltaX = event.touches[0].clientX - startXRef.current;
      setTranslateX(startTranslateXRef.current + deltaX);
      setTransitionOffset((deltaX * 100) / currentWidth);
      setTransitionOpacity(1 - Math.abs(deltaX) / currentWidth);
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    dragRef.current = false;
    const deltaX = translateX - startTranslateXRef.current;
    const deltaTimestamp = Date.now() - startTimestampRef.current;
    if (
      Math.abs(deltaX) / currentWidth >= 0.5 ||
      (Math.abs(deltaX) / deltaTimestamp) * 1000 > 100
    ) {
      if (deltaX < 0) {
        setDescription("TO LEFT");
      } else {
        setDescription("TO RIGHT");
      }
      performTransition();
    } else {
      setTranslateX(startTranslateXRef.current);
    }
    setTransitionOpacity(1);
  };

  const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    setDragging(true);
    dragRef.current = true;
    setCurrentWidth(event.currentTarget.clientWidth);
    startXRef.current = event.clientX;
    startTranslateXRef.current = translateX;
    if (swipeRef?.current?.style?.transition) {
      swipeRef.current.style.transition = "initial";
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    if (dragging) {
      const deltaX = event.clientX - startXRef.current;
      setDescription(deltaX < 0 ? "SWIPE left" : "SWIPE right");
      setTranslateX(startTranslateXRef.current + deltaX);
      setTransitionOffset((deltaX * 100) / currentWidth);
      setTransitionOpacity(1 - Math.abs(deltaX) / currentWidth);
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    event.preventDefault();
    setDragging(false);
    dragRef.current = false;
    const deltaX = translateX - startTranslateXRef.current;
    if (Math.abs(deltaX) / currentWidth >= 0.5) {
      if (deltaX < 0) {
        setDescription("TO LEFT");
      } else {
        setDescription("TO RIGHT");
      }
      performTransition();
    } else {
      setDescription("CANCEL");
    }
    setTranslateX(0);
    setTransitionOffset(0);
    setTransitionOpacity(1);
  };

  const handleMouseLeave = (event: MouseEvent) => {
    event.preventDefault();
    if (!dragging) return;

    // 필요한 작업 수행
    console.log(event);

    // setDragging(false);
    // setTranslateX(0);
    // setTransitionOffset(0);
    // setTransitionOpacity(1);
  };

  useEffect(() => {
    if (!animationRef.current) {
      return;
    }

    const keyframes = [
      { opacity: 1, transform: "translateX(0%)" },
      { opacity: 0, transform: "translateX(100%)" },
    ];

    const options: KeyframeAnimationOptions = {
      duration: 300,
      fill: "forwards",
    };

    let animation: Animation;

    function startAnimation() {
      if (!animationRef.current) {
        return;
      }

      animation = animationRef.current.animate(keyframes, options);

      animation.onfinish = () => {
        animation.cancel();
        setCardIndex((prev) => (prev + 1) % 4);
      };

      // animation.oncancel = () => {
      //   setCardIndex((prev) => (prev + 1) % 4);
      // };
    }

    const intervalId = window.setInterval(startAnimation, 3000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      if (animation) {
        animation.cancel();
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
          // className="card"
          // className={styles.move}
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
            // transform: `translateX(${transitionOffset}%)`,
            // opacity: transitionOpacity,
            // transition: "all 0.3s ease-in-out",
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
          // className={styles.move}
          style={{
            display: "block",
            position: "absolute",
            left: translateX,
            width: "100%",
            height: "100%",
            cursor: "pointer",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
