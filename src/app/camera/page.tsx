"use client";
import React, { useState } from "react";
import axios from "axios";
import CameraComponent from "@/app/camera/CameraComponent";

interface CardInfo {
  card_number: string;
  cvc: string;
  expiry_date: string;
}

const CameraPage: React.FC = () => {
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [cardInfo, setCardInfo] = useState<CardInfo>();

  const handleCapture = (blob: Blob) => {
    setPhoto(blob);
    const photoURL = URL.createObjectURL(blob);
    setPhotoURL(photoURL);

    const formData = new FormData();
    formData.append("file", blob, "photo.jpg");

    axios
      .post<CardInfo>("/api/extract_card_info/", formData)
      .then((response) => {
        setCardInfo(response.data);
      })
      .catch((error) => {
        console.error("Upload error", error);
      });
  };

  return (
    <div>
      <h1>Capture and Upload Photo</h1>
      <CameraComponent onCapture={handleCapture} />
      {photoURL && (
        <div>
          <h2>Captured Photo:</h2>
          <p>신용카드 번호: {cardInfo?.card_number}</p>
          <p>CVC: {cardInfo?.cvc}</p>
          <p>유효기간: {cardInfo?.expiry_date}</p>
          <img
            src={photoURL}
            alt="Captured"
            style={{ width: "30%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default CameraPage;
