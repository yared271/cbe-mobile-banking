import React, { useState } from 'react';
import { Upload, RotateCcw, Check, X, Image as ImageIcon } from 'lucide-react';
import defaultCbeLogo from '../assets/images/cbe_new_gold_logo_1790860237511.jpg';

interface CbeLogoModalProps {
  onClose: () => void;
  currentLogoUrl?: string;
  onUpdateLogo: (newUrl: string) => void;
}

export const CbeLogoModal: React.FC<CbeLogoModalProps> = ({
  onClose,
  currentLogoUrl,
  onUpdateLogo,
}) => {
  const [logoInput, setLogoInput] = useState(currentLogoUrl || defaultCbeLogo);
  const [preview, setPreview] = useState(currentLogoUrl || defaultCbeLogo);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setLogoInput(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateLogo(logoInput);
    localStorage.setItem('cbe_custom_logo_url', logoInput);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleResetDefault = () => {
    setLogoInput(defaultCbeLogo);
    setPreview(defaultCbeLogo);
    onUpdateLogo(defaultCbeLogo);
    localStorage.removeItem('cbe_custom_logo_url');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            የንግድ ባንክ ሎጎ (CBE Official Logo)
          </h3>
          <p className="text-xs text-slate-500">
            አዲሱ የንግድ ባንክ 3D የወርቅ ሎጎ ገብቷል፤ ሌላ ፎቶ ማስገባት ከፈለጉ ከስልክዎ መምረጥ ይችላሉ
          </p>
        </div>

        {/* Live Preview */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-purple-200">
          {preview ? (
            <img
              src={preview}
              alt="CBE Logo Preview"
              className="w-24 h-24 object-contain rounded-full shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-purple-100 text-[#74117c] flex items-center justify-center">
              <ImageIcon className="w-10 h-10" />
            </div>
          )}
          <span className="text-[11px] font-bold text-slate-600 mt-2">የሎጎ እይታ (Active Logo)</span>
        </div>

        {/* File Upload Input */}
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl text-[#74117c] font-bold cursor-pointer transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            <span>ሌላ ፎቶ ከስልክዎ ይምረጡ (Choose Image)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSave}
            className="w-full py-3 px-4 bg-[#74117c] hover:bg-[#600e67] text-white font-bold rounded-2xl text-xs shadow-md shadow-[#74117c]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {success ? <Check className="w-4 h-4 text-emerald-300" /> : <Check className="w-4 h-4" />}
            <span>{success ? 'ሎጎው ተቀምጧል!' : 'ይህን ሎጎ አጽድቅ (Confirm Logo)'}</span>
          </button>

          <button
            onClick={handleResetDefault}
            className="w-full py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ወደ አዲሱ የወርቅ ሎጎ መልስ (Reset Default)
          </button>
        </div>
      </div>
    </div>
  );
};
