import React, { useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { Download, X, Award, CheckCircle } from 'lucide-react';

interface CertificateModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ user, isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High Res Landscape Certificate: 1200 x 850
    canvas.width = 1200;
    canvas.height = 850;

    // 1. Soft botanical ivory-green tint background (#f2f8f3)
    ctx.fillStyle = '#f2f8f3';
    ctx.fillRect(0, 0, 1200, 850);

    // 2. Inner Pristine Pure White Mat (#ffffff)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(36, 36, 1128, 778);

    // 3. Elegant Botanical Double Borders
    // Outer Deep Emerald Border (#064E3B)
    ctx.strokeStyle = '#064E3B';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 1100, 750);

    // Inner Mint Green Hairline Border (#10B981)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(58, 58, 1084, 734);

    // Corner decorative botanical squares in emerald
    const corners = [
      [50, 50],
      [1142, 50],
      [50, 792],
      [1142, 792]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#064E3B';
      ctx.fillRect(cx - 4, cy - 4, 16, 16);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(cx - 1, cy - 1, 10, 10);
    });

    // 4. Header: Brand Monogram & Civic Headline in Greenery Palette
    ctx.fillStyle = '#064E3B';
    ctx.font = '600 28px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('FOODRESQ • BENGALURU CIVIC INITIATIVE', 600, 125);

    ctx.fillStyle = '#047857';
    ctx.font = '600 13px "Inter", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('OFFICIAL CERTIFICATE OF FOOD HERO PATRONAGE', 600, 158);

    // Top small laurel divider line
    ctx.strokeStyle = '#d1fae5';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 180);
    ctx.lineTo(850, 180);
    ctx.stroke();

    // 5. Presentation citation
    ctx.fillStyle = '#4b5563';
    ctx.font = 'italic 18px "Playfair Display", Georgia, serif';
    ctx.fillText('Presented in formal recognition of sovereign humanitarian service to', 600, 235);

    // 6. Recipient / Donor Name in bold Davinci serif
    ctx.fillStyle = '#064E3B';
    ctx.font = '700 46px "Playfair Display", Georgia, serif';
    ctx.fillText(user.name.toUpperCase(), 600, 305);

    // Ribbon underline in dual emerald and amber
    ctx.strokeStyle = '#064E3B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 328);
    ctx.lineTo(900, 328);
    ctx.stroke();

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(380, 333);
    ctx.lineTo(820, 333);
    ctx.stroke();

    // 7. Impact Metrics Citation
    const meals = user.mealsDonated || 3450;
    const kg = user.kgRescued || 1380;
    const co2 = Math.round(kg * 2.5);

    ctx.fillStyle = '#1f2937';
    ctx.font = '400 17px "Inter", sans-serif';
    ctx.fillText('For exceptional dedication in diverting fresh surplus banquet nourishment from landfill decay.', 600, 390);

    ctx.fillStyle = '#064E3B';
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillText(
      `This food hero has rescued ${meals.toLocaleString()} prepared meals (${kg.toLocaleString()} kg)`,
      600,
      426
    );

    ctx.fillStyle = '#4b5563';
    ctx.font = '400 16px "Inter", sans-serif';
    ctx.fillText(
      `preventing an estimated ${co2.toLocaleString()} kg of greenhouse gas emissions across Bengaluru.`,
      600,
      460
    );

    // 8. Botanical Seal Circle in Emerald & Gold
    ctx.strokeStyle = '#064E3B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(600, 555, 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(600, 555, 42, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#064E3B';
    ctx.font = '700 13px "Inter", sans-serif';
    ctx.fillText(`${user.badgeLevel.toUpperCase()} HERO`, 600, 550);
    ctx.fillStyle = '#047857';
    ctx.font = '600 10px "Inter", sans-serif';
    ctx.fillText('VERIFIED RESCUE', 600, 570);

    // 9. Signatures (Left: Mustaq Kamdoli | Right: Date & Verification)
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // LEFT SIGNATURE: MUSTAQ KAMDOLI
    ctx.textAlign = 'left';
    ctx.fillStyle = '#064E3B';
    ctx.font = 'italic 700 24px "Playfair Display", Georgia, serif';
    ctx.fillText('Mustaq Kamdoli', 140, 685);

    ctx.strokeStyle = '#064E3B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(140, 700);
    ctx.lineTo(400, 700);
    ctx.stroke();

    ctx.fillStyle = '#1f2937';
    ctx.font = '600 12px "Inter", sans-serif';
    ctx.fillText('Mustaq Kamdoli', 140, 720);

    ctx.fillStyle = '#4b5563';
    ctx.font = '400 11px "Inter", sans-serif';
    ctx.fillText('Director & Chief Coordinator', 140, 738);
    ctx.fillText('FoodResQ Bengaluru Initiative', 140, 754);

    // RIGHT SIGNATURE: OFFICIAL ATTESTATION & DATE
    ctx.textAlign = 'right';
    ctx.fillStyle = '#064E3B';
    ctx.font = '600 13px "Inter", sans-serif';
    ctx.fillText(`Issued on: ${today}`, 1060, 685);

    ctx.strokeStyle = '#064E3B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(820, 700);
    ctx.lineTo(1060, 700);
    ctx.stroke();

    ctx.fillStyle = '#1f2937';
    ctx.font = '600 11px "Inter", sans-serif';
    ctx.fillText(`Certificate ID: FRQ-${user.id.toUpperCase()}`, 1060, 720);

    ctx.fillStyle = '#4b5563';
    ctx.font = '400 11px "Inter", sans-serif';
    ctx.fillText('Authenticated via Bengaluru Surplus Network', 1060, 738);
    ctx.fillText('FSSAI Civic Food Sharing Compliant', 1060, 754);

  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `FoodResQ_Hero_Certificate_${user.name.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#f2f8f3] text-[#064E3B] w-full max-w-4xl rounded-[9px] p-6 sm:p-8 border border-[#10B981]/40 relative shadow-2xl max-h-[95vh] overflow-y-auto font-sans space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-[#047857] hover:text-[#064E3B] cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-[10px] font-mono uppercase tracking-widest border border-emerald-300 mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>Civic Recognition Attestation</span>
          </div>
          <h3 className="font-davinci text-2xl sm:text-3xl font-medium tracking-tight text-[#064E3B]">
            Food Hero Official Certificate
          </h3>
          <p className="text-xs text-[#4b5563] mt-1">
            Certifying your rescued meals, prevented carbon emissions, and civic patronage signed by <strong>Mustaq Kamdoli</strong>.
          </p>
        </div>

        {/* Certificate Canvas Preview (Greenish-Whitish Frame) */}
        <div className="p-3 bg-[#ffffff] rounded-[9px] border-2 border-[#064E3B]/20 shadow-md flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[55vh] object-contain rounded-[4px] border border-[#10B981]/30"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
          <span className="text-xs text-[#047857] flex items-center gap-1.5 font-medium">
            <CheckCircle className="w-4 h-4 text-[#10B981]" />
            <span>Attested by Director Mustaq Kamdoli • Printable High-Resolution PNG</span>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-[28.8px] border border-[#064E3B]/20 text-xs text-[#064E3B] hover:bg-emerald-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="btn-pill flex items-center gap-2 bg-[#064E3B] text-white hover:bg-[#047857]"
            >
              <Download className="w-4 h-4" />
              <span>Download Certificate PNG</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
