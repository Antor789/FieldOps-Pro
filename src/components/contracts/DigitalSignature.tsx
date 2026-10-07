import React, { useRef, useState, useEffect } from 'react';
import { Pen, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface DigitalSignatureProps {
  signerName: string;
  onSignerNameChange?: (name: string) => void;
  onSignatureCapture: (signatureDataUrl: string) => void;
  existingSignature?: string;
  className?: string;
}

export const DigitalSignature: React.FC<DigitalSignatureProps> = ({
  signerName,
  onSignerNameChange,
  onSignatureCapture,
  existingSignature,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(Boolean(existingSignature));
  const [penColor, setPenColor] = useState<string>('#1e3a8a'); // Royal Navy default
  const [designation, setDesignation] = useState('Authorized Signatory');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;

    // Load existing signature if provided
    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = existingSignature;
    }
  }, [existingSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSignatureCapture(dataUrl);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onSignatureCapture('');
  };

  const generatePredefinedSign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.font = 'italic bold 28px "Caveat", "Brush Script MT", cursive, sans-serif';
    ctx.fillStyle = penColor;
    const name = signerName.trim() || 'Fahim Rahman';
    ctx.fillText(name, 30, rect.height / 2 + 5);

    // Decorative flourish line underneath
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(25, rect.height / 2 + 15);
    ctx.bezierCurveTo(70, rect.height / 2 + 25, 140, rect.height / 2 + 5, 220, rect.height / 2 + 18);
    ctx.stroke();

    setHasDrawn(true);
    const dataUrl = canvas.toDataURL('image/png');
    onSignatureCapture(dataUrl);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Signer Name (স্বাক্ষরকারীর নাম) *
          </label>
          <input
            type="text"
            value={signerName}
            onChange={(e) => onSignerNameChange?.(e.target.value)}
            placeholder="e.g. Fahim Rahman / মোঃ করিম উদ্দিন"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Signer Designation / Title
          </label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="e.g. Facilities Director / Head of Engineering"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Signature Canvas Box */}
      <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2 overflow-hidden shadow-inner">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Pen className="w-3.5 h-3.5 text-blue-500" />
            Draw your signature inside the box (মাউস বা স্পর্শ দিয়ে স্বাক্ষর করুন)
          </span>

          <div className="flex items-center gap-2">
            {/* Ink color picker */}
            <span className="text-[11px]">Ink:</span>
            <button
              type="button"
              onClick={() => setPenColor('#1e3a8a')}
              className={`w-4 h-4 rounded-full bg-blue-900 transition-transform ${penColor === '#1e3a8a' ? 'scale-125 ring-2 ring-blue-500' : ''}`}
              title="Navy Blue"
            />
            <button
              type="button"
              onClick={() => setPenColor('#0f172a')}
              className={`w-4 h-4 rounded-full bg-slate-900 transition-transform ${penColor === '#0f172a' ? 'scale-125 ring-2 ring-slate-500' : ''}`}
              title="Black"
            />
            <button
              type="button"
              onClick={() => setPenColor('#047857')}
              className={`w-4 h-4 rounded-full bg-emerald-700 transition-transform ${penColor === '#047857' ? 'scale-125 ring-2 ring-emerald-500' : ''}`}
              title="Emerald Green"
            />
          </div>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-36 bg-white dark:bg-slate-950 cursor-crosshair rounded-lg touch-none"
        />

        {/* Guideline line for signature placement */}
        <div className="absolute left-6 right-6 bottom-10 pointer-events-none border-b border-slate-300 dark:border-slate-800 flex justify-between text-[10px] text-slate-400">
          <span>Sign above the line</span>
          <span>X</span>
        </div>

        {/* Canvas Toolbar Buttons */}
        <div className="flex items-center justify-between pt-2 px-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generatePredefinedSign}
            className="text-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Auto-Generate from Name
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearCanvas}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Canvas (মুছুন)
          </Button>
        </div>
      </div>

      {/* ICT Act 2006 Legal Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300">
        <AlertCircle className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <p className="font-semibold">Legal Enforceability in Bangladesh:</p>
          <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300/90 mt-0.5">
            By signing electronically, you certify that this signature carries the legal validity of a physical signature under the Bangladesh Information and Communication Technology (ICT) Act 2006 and the Contract Act 1872. Timestamp and IP hash will be recorded.
          </p>
        </div>
      </div>
    </div>
  );
};
