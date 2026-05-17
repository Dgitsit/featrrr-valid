"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import Button from "@/components/ui/Button";

async function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function getCroppedImageFile(
  imageSrc: string,
  crop: Area,
  fileName: string
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not prepare image crop");
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not crop image"));
          return;
        }

        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92
    );
  });
}

export default function ProfileImageUpload({
  currentImage,
  onUpload,
}: {
  currentImage?: string;
  onUpload: (file: File) => Promise<void> | void;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("profile.jpg");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setFileName(file.name.replace(/\.[^.]+$/, "") + "-cropped.jpg");
    setImageSrc(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    event.target.value = "";
  };

  const handleClose = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setSaving(false);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setSaving(true);
      const croppedFile = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        fileName
      );
      await onUpload(croppedFile);
      handleClose();
    } catch (error) {
      console.error("Crop upload failed:", error);
      setSaving(false);
    }
  };

  return (
    <>
      <label className="block cursor-pointer rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm transition hover:bg-white/[0.09]">
        <span className="flex items-center gap-3">
          <span className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-zinc-900">
            {currentImage ? (
              <img
                src={currentImage}
                alt="Current profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-black text-zinc-600">
                FV
              </span>
            )}
          </span>
          <span className="min-w-0">
            <span className="block font-semibold text-white">
              Upload Photo (+3 pts)
            </span>
            <span className="block text-xs text-zinc-500">
              Crop and position your credential image.
            </span>
          </span>
        </span>
        <input hidden type="file" accept="image/*" onChange={handleSelect} />
      </label>

      {imageSrc && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/80 px-4 py-5 backdrop-blur sm:items-center sm:justify-center">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b12] shadow-2xl shadow-black/60">
            <div className="border-b border-white/10 p-4">
              <h2 className="text-base font-semibold text-white">
                Crop profile photo
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Pinch-style zoom and drag to center your face in the circle.
              </p>
            </div>

            <div className="relative h-80 w-full bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) =>
                  setCroppedAreaPixels(areaPixels)
                }
              />
            </div>

            <div className="space-y-4 p-4">
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Zoom
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="mt-3 w-full accent-purple-400"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" full onClick={handleClose}>
                  Cancel
                </Button>
                <Button full loading={saving} onClick={handleSave}>
                  Save Photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
