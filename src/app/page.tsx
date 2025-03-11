"use client";

import { useRef, useState, useEffect } from "react";

export default function Mockup() {
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputFileRef = useRef(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasUpload = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const uploadedImage = new Image();
    if (typeof imageUrl === "string") {
      uploadedImage.src = imageUrl;
    }

    const defaultImage = new Image();
    defaultImage.src = "/laptop.png";

    uploadedImage.onload = () => {
      if (canvas && ctx) {
        const canvasWidth = 600;
        const canvasHeight = 400;

        const innerMockupWidth = 460;
        const innerMockupHeight = 290;

        const innerYOffset = 18;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const scale = innerMockupHeight / uploadedImage.height;
        const scaledWidth = uploadedImage.width * scale;
        const cropX = (scaledWidth - innerMockupWidth) / 2;

        ctx.drawImage(
          uploadedImage,
          cropX / scale,
          0,
          uploadedImage.width - (2 * cropX) / scale,
          uploadedImage.height,
          canvasWidth / 2 - innerMockupWidth / 2,
          canvasHeight / 2 - innerMockupHeight / 2 - innerYOffset,
          innerMockupWidth,
          innerMockupHeight
        );

        defaultImage.onload = () => {
          const aspectRatio = defaultImage.width / defaultImage.height;
          let drawWidth = canvasWidth;
          let drawHeight = canvasWidth / aspectRatio;
          if (drawHeight > canvasHeight) {
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * aspectRatio;
          }
          ctx.drawImage(
            defaultImage,
            canvasWidth / 2 - drawWidth / 2,
            canvasHeight / 2 - drawHeight / 2,
            drawWidth,
            drawHeight
          );
        };
      }
    };
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "mockup.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  useEffect(() => {
    if (imageUrl) {
      handleCanvasUpload();
    }
  }, [imageUrl]);

  return (
    <div className="w-screen h-screen p-64 flex justify-center align-center">
      <label htmlFor="mockup" className="p-1 fixed top-4 right-4 cursor-button">
        <h2>Upload een foto</h2>
        <input
          type="file"
          className="cursor-button hidden"
          accept="image/*"
          ref={inputFileRef}
          onChange={handleImageUpload}
          id="mockup"
        />
      </label>
      <button
        className="cursor-button p-1 fixed top-4 left-4"
        onClick={downloadCanvas}
      >
        Download
      </button>

      {imageUrl && (
        <canvas ref={canvasRef}>Your browser does not support canvas.</canvas>
      )}
    </div>
  );
}
