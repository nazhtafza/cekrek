// src/components/WebcamCapture.tsx

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";



const FRAME_URL = "https://www.pngkey.com/png/full/8-88688_polaroid-frame-png-transparent-background-polaroid-frame-png.png";
// ----------------

export function WebcamCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("my-photobox-photo");
  const [isFlashing, setIsFlashing] = useState(false);

  
  const frameImageRef = useRef(new Image());
  // ----------------
  


  const startWebcam = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Gagal mengakses webcam. Pastikan Anda mengizinkan akses kamera.");
    }
  }, []);

  
  const takePhoto = useCallback(() => {
    
    if (videoRef.current && canvasRef.current && frameImageRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const frame = frameImageRef.current; 
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert("Kamera belum siap. Coba klik lagi.");
        return;
      }
      
     
      if (!frame.complete || frame.naturalWidth === 0) {
        alert("Frame gambar belum siap. Coba lagi sesaat.");
        return;
      }

      canvas.width = frame.naturalWidth;
      canvas.height = frame.naturalHeight;

      const context = canvas.getContext("2d");
      if (context) {
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

       
        context.drawImage(frame, 0, 0, canvas.width, canvas.height);

        
        const imageDataURL = canvas.toDataURL("image/png");

       
        setIsFlashing(true); 
        setTimeout(() => {
          setIsFlashing(false);
          setPhoto(imageDataURL); 
        }, 150);
      }
    }
  }, []); 

 
  const retakePhoto = useCallback(() => {
    setPhoto(null);
    setFileName("my-photobox-photo");
    if (!stream) {
        startWebcam(); 
    }
  }, [stream, startWebcam]);

 
  const downloadPhoto = useCallback(() => {
    if (photo) {
      const link = document.createElement("a");
      link.href = photo;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [photo, fileName]);


  useEffect(() => {
    startWebcam();


    frameImageRef.current.crossOrigin = "anonymous"; 
    frameImageRef.current.src = FRAME_URL;
    frameImageRef.current.onload = () => {
      console.log("Gambar frame berhasil di-load.");
    };
    frameImageRef.current.onerror = () => {
        console.error("Gagal me-load gambar frame.");
    };
    // ------------

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startWebcam, stream]); 

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative w-full max-w-lg mb-4 rounded-lg overflow-hidden border border-gray-300 shadow-lg">
        <video 
          ref={videoRef} 
          className="w-full h-auto" 
          autoPlay 
          playsInline 
          muted 
        />
        <canvas ref={canvasRef} className="hidden" /> 
        {isFlashing && (
          <div className="absolute inset-0 bg-white opacity-90 z-10" />
        )}
      </div>

      <Button 
        onClick={takePhoto} 
        className="mb-6 px-8 py-4 text-lg font-bold"
        disabled={!stream}
      >
        Ambil Foto!
      </Button>

      <Dialog open={!!photo} onOpenChange={(open) => !open && retakePhoto()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Foto Anda</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {photo && <img src={photo} alt="Captured" className="w-full h-auto rounded-md" />}
            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <label htmlFor="fileName" className="text-right">
                Nama File
              </label>
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={retakePhoto}>
              Ulangi
            </Button>
            <Button onClick={downloadPhoto}>
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}