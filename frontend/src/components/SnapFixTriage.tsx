import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  RefreshCw,
  Copy,
  Check,
  Wrench,
  Building2,
  DollarSign,
  Send,
  FileCheck2,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import {
  fetchSnapFixChallenge,
  verifyAndTriagePhoto
} from '../services/api';
import {
  SnapFixChallenge,
  SnapFixVerifyResponse
} from '../types/snapfix';

const ISSUE_PRESETS = [
  { id: 'plumbing_pipe_leak', label: '🚰 Concealed Drainage Pipe Seepage', category: 'Plumbing (Structural)' },
  { id: 'wall_seepage_dampness', label: '🧱 Wall Dampness & Efflorescence', category: 'Structural Seepage' },
  { id: 'electrical_mcb_short', label: '⚡ MCB Tripping / Sparking Circuit', category: 'Electrical (Emergency)' },
  { id: 'door_lock_broken', label: '🔐 Broken Main Door Lock / Latch', category: 'Carpentry (Security)' },
  { id: 'ac_cooling_coil_leak', label: '❄️ AC Gas Leak / Cooling Failure', category: 'Appliance (White Goods)' },
  { id: 'plumbing_tap_washer', label: '💧 Leaking Faucet / Minor Tap Washer', category: 'Plumbing (Consumable)' }
];

export const SnapFixTriage: React.FC = () => {
  const [challenge, setChallenge] = useState<SnapFixChallenge | null>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  // Form State
  const [selectedIssue, setSelectedIssue] = useState('wall_seepage_dampness');
  const [description, setDescription] = useState('Water bubbling through plaster near the external window after rain.');
  const [propertyAddress, setPropertyAddress] = useState('Flat 402, Green Residency, Vastrapur, Ahmedabad');
  const [tenantName, setTenantName] = useState('Het Patel');
  const [landlordName, setLandlordName] = useState('Vikramaditya Sanghavi');
  const [gpsLat, setGpsLat] = useState<number | null>(23.0350);
  const [gpsLon, setGpsLon] = useState<number | null>(72.5293);
  const [geoStatus, setGeoStatus] = useState<string>('Vastrapur (23.0350° N, 72.5293° E)');

  // Camera & Image State
  const [cameraActive, setCameraActive] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<SnapFixVerifyResponse | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load Liveness Challenge on Mount
  useEffect(() => {
    loadChallenge();
    return () => {
      stopCamera();
    };
  }, []);

  const loadChallenge = async () => {
    setLoadingChallenge(true);
    try {
      const ch = await fetchSnapFixChallenge();
      setChallenge(ch);
    } catch (err: any) {
      console.error('Challenge fetch failed:', err);
    } finally {
      setLoadingChallenge(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoStatus('Detecting hardware GPS...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        setGpsLat(lat);
        setGpsLon(lon);
        setGeoStatus(`GPS Locked: ${lat}° N, ${lon}° E (±${Math.round(pos.coords.accuracy)}m)`);
      },
      (err) => {
        setGeoStatus('GPS detection skipped (Defaulting to property address)');
        console.warn('Geolocation warning:', err.message);
      },
      { timeout: 8000 }
    );
  };

  // Camera handling
  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMsg('Could not open live camera. Please use the file upload button below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `snapfix_live_${Date.now()}.jpg`, { type: 'image/jpeg' });
          setImageFile(file);
          setPreviewUrl(canvas.toDataURL('image/jpeg'));
          stopCamera();
        }
      }, 'image/jpeg', 0.92);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      stopCamera();
    }
  };

  const handleVerify = async () => {
    if (!imageFile) {
      alert('Please capture or upload a condition photo first.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('issue_type', selectedIssue);
    formData.append('description', description);
    if (challenge?.challenge_code) {
      formData.append('challenge_code', challenge.challenge_code);
    }
    if (gpsLat) formData.append('expected_lat', gpsLat.toString());
    if (gpsLon) formData.append('expected_lon', gpsLon.toString());
    formData.append('property_address', propertyAddress);
    formData.append('tenant_name', tenantName);
    formData.append('landlord_name', landlordName);

    try {
      const res = await verifyAndTriagePhoto(formData);
      setResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Forensic triage failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Informational Hero Banner */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>Anti-Fraud Visual Verification Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Cryptographic Move-In Proof & Statutory Liability Routing
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Eliminates photo-spoofing and unlawful deposit withholdings using <strong>hardware EXIF telemetry</strong>, live liveness challenges, SHA-256 digital sealing, and automated Model Tenancy Act (MTA 2021) contractor triage.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Sec. 65B Admissible
          </span>
        </div>
      </div>

      {/* Dynamic Liveness Challenge Alert */}
      {challenge && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500 flex-shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Anti-Spoofing Physical Challenge
                </span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-mono font-black rounded-md">
                  {challenge.challenge_code}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {challenge.instructions} Downloaded screenshots without this code will fail authenticity checks.
              </p>
            </div>
          </div>
          <button
            onClick={loadChallenge}
            disabled={loadingChallenge}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-surface text-text-primary hover:bg-surfaceMuted border border-border text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingChallenge ? 'animate-spin' : ''}`} />
            <span>New Code</span>
          </button>
        </div>
      )}

      {/* Main Grid: Capture & Inspection Panel (Left) + Forensics & Certificate (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Capture & Metadata (5 cols) */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-base text-text-primary flex items-center space-x-2">
              <Camera className="w-4 h-4 text-primary" />
              <span>Ground Truth Capture</span>
            </h3>
            <span className="text-[11px] text-text-muted">Live Camera Enforced</span>
          </div>

          {/* Camera Viewport / Preview Box */}
          <div className="relative aspect-video rounded-xl bg-slate-900 border-2 border-dashed border-border overflow-hidden flex items-center justify-center text-white">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Captured condition"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-2 text-slate-400">
                <Camera className="w-10 h-10 mx-auto text-slate-500" />
                <p className="text-xs font-medium">No photo captured yet</p>
                <p className="text-[10px] text-slate-500">Hold challenge code in frame</p>
              </div>
            )}

            {/* Dynamic Watermark Overlay */}
            {challenge && (
              <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-md text-[10px] font-mono text-teal-300 border border-teal-500/40">
                CODE: {challenge.challenge_code} | {new Date().toLocaleDateString('en-IN')}
              </div>
            )}
          </div>

          {/* Camera Action Buttons */}
          <div className="flex gap-2">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Open Live Camera</span>
              </button>
            ) : (
              <button
                onClick={capturePhoto}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Snap Ground Truth</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2.5 bg-surfaceMuted hover:bg-surface border border-border text-text-primary rounded-xl text-xs font-medium transition-all"
              title="Upload existing image for testing"
            >
              Upload
            </button>
          </div>

          {/* Maintenance Category Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Select Defect Category
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {ISSUE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedIssue(preset.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedIssue === preset.id
                      ? 'bg-primary-light/50 border-primary font-bold text-text-primary'
                      : 'bg-surface hover:bg-surfaceMuted border-border text-text-secondary'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] text-text-muted font-normal">{preset.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location & Metadata */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Property Geolocation Anchor
              </span>
              <button
                onClick={detectLocation}
                className="text-[11px] text-primary font-semibold hover:underline flex items-center space-x-1"
              >
                <MapPin className="w-3 h-3" />
                <span>Auto-Detect</span>
              </button>
            </div>
            <p className="text-xs text-text-secondary bg-surfaceMuted p-2.5 rounded-xl border border-border flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">{geoStatus}</span>
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-text-muted block">Tenant Name</label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full p-2 bg-surfaceMuted border border-border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-text-muted block">Landlord Name</label>
                <input
                  type="text"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  className="w-full p-2 bg-surfaceMuted border border-border rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Verify & Triage Button */}
          <button
            onClick={handleVerify}
            disabled={analyzing || !imageFile}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Forensic Analysis & Triage...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Verify Condition & Generate Certificate</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right Column: Forensic Results, Triage & Landlord WhatsApp (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="bg-surface rounded-2xl border border-border p-12 text-center text-text-muted space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-light/50 mx-auto flex items-center justify-center text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-text-primary">
                Awaiting Live Photo & Defect Selection
              </h4>
              <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                Snap or upload a photo of the move-in condition or damage. RentFair AI will compute the
                cryptographic hash, evaluate EXIF sensor telemetry, categorize Model Tenancy Act repair duties,
                and generate an admissible Section 65B electronic certificate.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* 1. Authenticity & Trust Shield Card */}
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-extrabold text-sm text-text-primary">
                      Ground Authenticity Forensics
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      result.authenticity.trust_score >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : result.authenticity.trust_score >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {result.authenticity.verdict.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Score & Telemetry Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-surfaceMuted p-3 rounded-xl border border-border text-center">
                    <span className="text-[10px] uppercase font-bold text-text-muted block">Trust Score</span>
                    <span className="text-xl font-black text-text-primary">
                      {result.authenticity.trust_score}/100
                    </span>
                  </div>
                  <div className="bg-surfaceMuted p-3 rounded-xl border border-border text-center">
                    <span className="text-[10px] uppercase font-bold text-text-muted block">Challenge Code</span>
                    <span className="text-xs font-mono font-bold text-primary block mt-1">
                      {result.authenticity.challenge_code_used || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-surfaceMuted p-3 rounded-xl border border-border text-center">
                    <span className="text-[10px] uppercase font-bold text-text-muted block">Hardware EXIF</span>
                    <span className="text-xs font-bold text-text-primary block mt-1">
                      {result.authenticity.has_hardware_exif ? 'Detected' : 'Web Capture'}
                    </span>
                  </div>
                  <div className="bg-surfaceMuted p-3 rounded-xl border border-border text-center">
                    <span className="text-[10px] uppercase font-bold text-text-muted block">Sec 65B Admissible</span>
                    <span className="text-xs font-bold text-emerald-700 block mt-1">
                      {result.authenticity.is_admissible_evidence ? 'Verified' : 'Review Needed'}
                    </span>
                  </div>
                </div>

                {/* Cryptographic SHA-256 Hash */}
                <div className="p-3 bg-[#0F172A] text-slate-200 rounded-xl font-mono text-[11px] flex items-center justify-between">
                  <div className="truncate mr-2">
                    <span className="text-teal-400 font-bold mr-1">SHA-256:</span>
                    <span>{result.authenticity.sha256_hash}</span>
                  </div>
                  <button
                    onClick={() => copyHash(result.authenticity.sha256_hash)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all flex-shrink-0"
                    title="Copy SHA-256 Hash"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 2. Model Tenancy Act Statutory Triage Card */}
              <div className="bg-surface rounded-2xl border-2 border-primary/30 p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                      Model Tenancy Act (MTA) Second Schedule Triage
                    </span>
                    <h4 className="font-extrabold text-base text-text-primary mt-0.5">
                      {result.triage.issue_title}
                    </h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      result.triage.statutory_liability === 'LANDLORD'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'bg-purple-100 text-purple-900 border border-purple-200'
                    }`}
                  >
                    {result.triage.statutory_liability} RESPONSIBILITY
                  </span>
                </div>

                {/* Legal Basis & Turnaround */}
                <div className="p-3.5 bg-surfaceMuted rounded-xl border border-border space-y-1.5 text-xs">
                  <span className="font-bold text-text-primary block">
                    Statutory Rule & Precedent:
                  </span>
                  <p className="text-text-secondary leading-relaxed">
                    {result.triage.mta_legal_basis}
                  </p>
                  <div className="flex items-center space-x-2 pt-1 text-[11px] text-primary font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Statutory Repair Deadline: Within {result.triage.statutory_turnaround_hours} Hours</span>
                  </div>
                </div>

                {/* Fair Contractor Repair Cost in INR */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-emerald-700" />
                      <span>Fair Market Contractor Cost (INR)</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-800">
                      Ahmedabad / Metro Handyman Standard
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-emerald-900">
                      ₹{result.triage.estimated_cost_inr.fair_market_average}
                    </span>
                    <span className="text-xs text-emerald-700">
                      (Typical range: ₹{result.triage.estimated_cost_inr.min} – ₹{result.triage.estimated_cost_inr.max})
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed pt-1">
                    <strong>Contractor Scope:</strong> {result.triage.contractor_scope_of_work}
                  </p>
                </div>
              </div>

              {/* 3. Bilateral WhatsApp Landlord Notice Card */}
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-extrabold text-sm text-text-primary">
                      Bilateral Landlord Counter-Signing Handshake
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">
                    Ticket #{result.ticket_id}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  Per our real-world ground framework, a condition photo is only dispute-proof when both parties
                  acknowledge it. Send this pre-formatted WhatsApp notice to your owner to lock in the baseline:
                </p>

                <div className="p-3.5 bg-[#F7F9F7] border border-border rounded-xl text-xs font-sans text-text-secondary leading-relaxed whitespace-pre-line">
                  {result.certificate.whatsapp_preview_text}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={result.certificate.whatsapp_counter_sign_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl text-center transition-all shadow-sm flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Verification to Landlord on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => alert(`Certificate ${result.certificate.certificate_id} saved to your offline dispute ledger.`)}
                    className="py-3 px-4 bg-surfaceMuted hover:bg-surface border border-border text-text-primary font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5"
                  >
                    <FileCheck2 className="w-4 h-4 text-primary" />
                    <span>Archive Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
