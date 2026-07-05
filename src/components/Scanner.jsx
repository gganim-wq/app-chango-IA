import React, { useState } from 'react';
import { Camera, Keyboard, X, Scan, Barcode, ChevronLeft } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function Scanner({ onScanSuccess, onScanError, onClose }) {
  const [manualEan, setManualEan] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);

  const qrRegionId = 'html5-qr-reader';

  const startWebcam = async () => {
    setCameraError('');
    setIsScanning(true);
    setTimeout(async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) throw new Error("No se detectaron cámaras.");
        const html5Qrcode = new Html5Qrcode(qrRegionId);
        setScannerInstance(html5Qrcode);
        await html5Qrcode.start(
          { facingMode: "environment" },
          { fps: 25, qrbox: { width: 280, height: 280 }, aspectRatio: 1.0 },
          (decodedText) => {
            html5Qrcode.stop().then(() => {
              setIsScanning(false);
              onScanSuccess(decodedText);
            });
          },
          () => {}
        );
      } catch (err) {
        setCameraError("Error al iniciar cámara. Verifica permisos.");
        setIsScanning(false);
      }
    }, 400);
  };

  const stopWebcam = async () => {
    if (scannerInstance?.isScanning) {
      await scannerInstance.stop();
    }
    setIsScanning(false);
    setScannerInstance(null);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualEan.length >= 5) {
      onScanSuccess(manualEan.replace(/\D/g, ''));
      setManualEan('');
    }
  };

  return (
    <div className="w-full h-full bg-black flex flex-col sm:rounded-[4rem] overflow-hidden animate-fade-in relative">
      
      {/* HEADER FIGMA (Imagen 2) */}
      <header className="pt-14 pb-6 px-10 flex justify-between items-center bg-black">
          <button onClick={onClose} className="text-white opacity-60"><ChevronLeft className="w-7 h-7" /></button>
          <div className="flex items-center gap-1">
            <span className="text-white font-black text-xl tracking-tighter">Mi Changuito </span>
            <span className="text-figmaPurple font-black text-xl tracking-tighter">IA</span>
          </div>
          <button onClick={onClose} className="text-white opacity-60"><X className="w-7 h-7" /></button>
      </header>

      <div className="flex-1 flex flex-col items-center px-10 pb-12 space-y-8 no-scrollbar">

          <h3 className="text-[10px] font-bold text-center text-gray-600 uppercase tracking-[0.4em] pt-4">
            ESCANEAR PRODUCTOS
          </h3>

          {/* ÁREA DE ESCANEO FIGMA STYLE (Imagen 2) */}
          <div className="relative w-full aspect-[4/5] max-w-[340px] rounded-[3rem] overflow-hidden border-2 border-white/10 shadow-2xl">
             {!isScanning ? (
                <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center space-y-4 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale"></div>
                    <Scan className="w-16 h-16 text-figmaCyan relative z-10 animate-pulse" />
                    <button onClick={startWebcam} className="px-6 py-3 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest relative z-10 border border-white/20">Activar Cámara</button>
                </div>
             ) : (
                <div className="w-full h-full relative bg-black">
                    <div id={qrRegionId} className="w-full h-full object-cover"></div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[80%] h-[60%] border-2 border-figmaCyan/30 rounded-[2rem] relative">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-figmaCyan rounded-tl-2xl"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-figmaCyan rounded-tr-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-figmaCyan rounded-bl-2xl"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-figmaCyan rounded-br-2xl"></div>
                            <div className="w-full h-0.5 bg-figmaCyan shadow-[0_0_15px_#00D1FF] absolute top-1/2 -translate-y-1/2 opacity-50"></div>
                        </div>
                    </div>
                </div>
             )}
          </div>

          <p className="text-[11px] font-black text-white uppercase tracking-[0.25em] opacity-80">
              ESCANEA EL CÓDIGO DE BARRAS
          </p>

          {/* INGRESO MANUAL FIGMA STYLE (Imagen 2) */}
          <div className="w-full pt-10">
             <form onSubmit={handleManualSubmit} className="flex flex-col gap-6">
                <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl flex items-center px-6 py-5 gap-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Código de Barras (EAN)"
                        value={manualEan}
                        onChange={(e) => setManualEan(e.target.value)}
                        className="flex-1 bg-transparent text-white text-sm font-bold tracking-widest focus:outline-none placeholder:text-gray-700"
                        maxLength={13}
                    />
                    <button type="submit" className="text-white font-black text-xs uppercase tracking-widest pr-2">CARGAR</button>
                </div>

                <button
                    onClick={onClose}
                    type="button"
                    className="w-full bg-[#1A1A1A] text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-lg active:scale-[0.98] transition-all"
                >
                    CERRAR
                </button>
             </form>
          </div>

          {cameraError && (
            <div className="p-4 bg-figmaRed/10 border border-figmaRed/20 text-figmaRed text-[10px] font-black rounded-3xl text-center uppercase tracking-widest">
              {cameraError}
            </div>
          )}

      </div>
    </div>
  );
}
