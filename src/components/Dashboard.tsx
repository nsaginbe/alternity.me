import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { resizeImageFromDataUrl, dataUrlToFile } from '@/lib/utils';
import { CelebrityImage, CelebrityImageWithUnsplash, CelebrityImageMultiSource } from './CelebrityImage';
import { useUser, useClerk } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import {
  Star,
  Sparkles,
  Palette,
  User as UserIcon,
  Upload,
  Camera,
  BarChart3,
  Heart,
  Eye,
  Brain,
  Target,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  MenuIcon,
  RefreshCw,
  Check,
  Sun,
  Users,
  FileImage,
} from 'lucide-react';
import { CelebrityMatchCard } from './CelebrityMatchCard';
import logoOnly from '/src/assets/logo-only-transparent.png';
import MBTIQuiz from './MBTIQuiz';
import imageCompression from "browser-image-compression";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

type DashboardSection = 'celebrity' | 'animal' | 'color' | 'personality' | 'analytics' | 'settings';

interface CelebrityMatch {
  name: string;
  similarity: number;
}

interface SpiritAnimalResult {
  animal: string;
  reason: string;
  imageUrl?: string;
}

interface ColorAnalysisResult {
  mood_name: string;
  description: string;
  palette: string[];
}

interface ApiResponse extends Array<CelebrityMatch> {}



// Removed DevelopmentBadge and all 'COMING SOON' badges/usages

export default function Dashboard() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<DashboardSection>('celebrity');

  const [uploadMode, setUploadMode] = useState<'upload' | 'webcam' | 'results'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default for mobile
  const [celebrityMatches, setCelebrityMatches] = useState<CelebrityMatch[]>([]);
  const [spiritAnimalResult, setSpiritAnimalResult] = useState<SpiritAnimalResult | null>(null);
  const [colorResult, setColorResult] = useState<ColorAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // This will be removed
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const { user } = useUser();
  const { signOut } = useClerk();

  // Handle URL parameters for direct section navigation
  useEffect(() => {
    const section = searchParams.get('section') as DashboardSection;
    if (section && ['celebrity', 'animal', 'color', 'personality', 'analytics', 'settings'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Auto-open sidebar on desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Convert image to base64 without data URL prefix
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('🔄 Converting image to base64...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        console.log('✅ FileReader loaded, data URL length:', result.length);

        // Remove the data URL prefix (data:image/jpeg;base64,)
        const base64Data = result.split(',')[1];
        console.log('✅ Base64 data extracted, length:', base64Data.length);
        resolve(base64Data);
      };
      reader.onerror = (error) => {
        console.error('❌ FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const findSpiritAnimal = async (base64ImageData: string): Promise<SpiritAnimalResult> => {
    const apiUrl = import.meta.env.VITE_CATEGORY_BACK_API_URL;
    console.log(`🦁 Starting API call to ${apiUrl}/animal`);

    try {
      const response = await fetch(`${apiUrl}/animal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64ImageData })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      
      if (!data.animal || !data.reason) {
        throw new Error('Invalid response format from server.');
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Network error - API server may not be running');
        throw new Error(`Cannot connect to API server`);
      }
      throw error;
    }
  };

  const analyzeColorPalette = async (base64ImageData: string): Promise<ColorAnalysisResult> => {
    const apiUrl = 'http://localhost:5001/api/analyze_color'; // Using fixed URL for now
    console.log(`🎨 Starting API call to ${apiUrl}`);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64ImageData })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (!data.mood_name || !data.description || !data.palette) {
        throw new Error('Invalid response format from color analysis API.');
      }
      return data;
    } catch (error) {
      console.error('❌ Error calling color analysis API:', error);
      throw error;
    }
  };

  // Call celebrity lookalike API
  const findCelebLookalike = async (base64ImageData: string): Promise<ApiResponse> => {
    const apiUrl = import.meta.env.VITE_BACK_API_URL;
    console.log(`🚀 Starting API call to ${apiUrl}/find`);
    console.log('📦 Base64 data length:', base64ImageData.length);

    try {
      const response = await fetch(`${apiUrl}/find`, {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg'
        },
        body: base64ImageData
      });

      console.log('📊 API Response status:', response.status);
      console.log('📊 API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);

        switch (response.status) {
          case 400:
            throw new Error('Invalid image format. Please upload a valid image.');
          case 422:
            throw new Error('Image is too large or invalid. Please try a smaller image.');
          default:
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);

      // Handle empty response (no face detected)
      if (Array.isArray(data) && data.length === 0) {
        console.log('⚠️ Empty response from API - no face detected');
        throw new Error('No face detected in the image. Please upload a clear photo with a visible face.');
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Network error - API server may not be running');
        throw new Error(`Cannot connect to API server`);
      }
      throw error;
    }
  };

  // Handle file preview
  useEffect(() => {
    if (uploadedFile && uploadMode !== 'webcam') {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (uploadMode === 'webcam' && capturedImage) {
      setPreviewUrl(capturedImage);
    } else {
      setPreviewUrl(null);
    }
  }, [uploadedFile, capturedImage, uploadMode]);

  // Clear captured image when switching modes
  useEffect(() => {
    if (uploadMode !== 'webcam') {
      setCapturedImage(null);
    }
  }, [uploadMode]);

  // Webcam capture using react-webcam Hook pattern
  const handleCapture = useCallback(async () => {
    console.log('📷 Capturing photo with react-webcam...');
    if (!webcamRef.current) {
      toast.error('Camera not available. Please try again.');
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      toast.error('Failed to capture photo. Please try again.');
      return;
    }

    console.log('✅ Screenshot captured, resizing...');
    const resizedImage = await resizeImageFromDataUrl(imageSrc, 512, 0.9);
    setCapturedImage(resizedImage);
  }, [webcamRef]);

  const handleAnalyzeCapturedPhoto = async () => {
    if (!capturedImage) {
      toast.error('Please capture a photo first.');
      return;
    }

    try {
      setIsProcessing(true);

      const capturedFile = dataUrlToFile(capturedImage, 'webcam-capture.jpg');
      setUploadedFile(capturedFile);

      console.log('🔄 Processing captured image...');

      const base64Data = await convertImageToBase64(capturedFile);
      
      if (activeSection === 'celebrity') {
        const matches = await findCelebLookalike(base64Data);
        setCelebrityMatches(matches);
        setCurrentMatchIndex(0);
      } else if (activeSection === 'animal') {
        const result = await findSpiritAnimal(base64Data);
        setSpiritAnimalResult(result);
      } else if (activeSection === 'color') {
        const result = await analyzeColorPalette(base64Data);
        setColorResult(result);
      }
      
      setUploadMode('results');

      console.log('✅ Webcam capture and processing completed!');
    } catch (error) {
      console.error('❌ Error processing webcam image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process image. Please try again.');
      setUploadMode('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const sidebarItems = [
    { id: 'celebrity', label: t('dashboard.sidebar.celebrity'), icon: Star, color: 'text-yellow-600' },
    { id: 'animal', label: t('dashboard.sidebar.animal'), icon: Sparkles, color: 'text-emerald-600' },
    { id: 'color', label: t('dashboard.sidebar.color'), icon: Palette, color: 'text-pink-600' },
    { id: 'personality', label: t('dashboard.sidebar.personality'), icon: Eye, color: 'text-blue-600' },
    { id: 'analytics', label: t('dashboard.sidebar.analytics'), icon: BarChart3, color: 'text-indigo-600' },
    { id: 'settings', label: t('dashboard.sidebar.settings'), icon: Settings, color: 'text-gray-600' }
  ];

  const handleSectionChange = (section: DashboardSection) => {
    setActiveSection(section);
    setSearchParams({ section });
    // Reset state when changing sections to avoid showing old results
    setUploadMode('upload');
    setCelebrityMatches([]);
    setSpiritAnimalResult(null);
    setColorResult(null);
    setUploadedFile(null);
    setCapturedImage(null);
    setCurrentMatchIndex(0);
  };

  const handleNavigateMatch = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentMatchIndex > 0) {
      setCurrentMatchIndex(currentMatchIndex - 1);
    } else if (direction === 'next' && currentMatchIndex < celebrityMatches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    }
  };



  const handleFileSelect = async (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (10MB max до сжатия)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      try {
        setIsProcessing(true);
        setApiError(null);

        // Сжимаем и ресайзим изображение
        const compressedFile = await imageCompression(file, {
          maxWidthOrHeight: 2000, // или меньше, если сервер ограничивает
          maxSizeMB: 2,           // или меньше, если сервер ограничивает
          useWebWorker: true,
        });

        setUploadedFile(compressedFile);

        // Для превью
        const previewUrl = URL.createObjectURL(compressedFile);
        setPreviewUrl(previewUrl);

      } catch (err: any) {
        setApiError("❌ Error compressing image: " + err.message);
        setUploadedFile(null);
        setPreviewUrl(null);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleUploadPhoto = async () => {
    if (uploadedFile) {
      console.log('📁 Starting photo upload and processing...', uploadedFile.name);
      setIsProcessing(true);

      try {
        console.log('🔄 Step 1: Converting to base64...');
        const base64Data = await convertImageToBase64(uploadedFile);

        console.log(`🔄 Step 2: Calling API for section: ${activeSection}...`);
        if (activeSection === 'celebrity') {
          const matches = await findCelebLookalike(base64Data);
          setCelebrityMatches(matches);
          setCurrentMatchIndex(0);
        } else if (activeSection === 'animal') {
          const result = await findSpiritAnimal(base64Data);
          setSpiritAnimalResult(result);
        } else if (activeSection === 'color') {
          const result = await analyzeColorPalette(base64Data);
          setColorResult(result);
        }

        console.log('🔄 Step 3: Processing results...');
        setUploadMode('results');

        console.log('✅ Photo processing completed successfully!');
      } catch (error) {
        console.error('❌ Error processing image:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to process image. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUseWebcam = () => {
    setUploadMode('webcam');
    setCapturedImage(null);
  };

  const handleCapturePhoto = () => {
    // This function is now deprecated in favor of handleCapture and handleAnalyzeCapturedPhoto
    // It can be removed if no longer referenced elsewhere, but we keep it for now.
    handleCapture();
  };

  const renderAnimalSection = () => {
    if (uploadMode === 'results' && spiritAnimalResult) {
      return (
        <div className="max-w-4xl mx-auto text-center">
          <Card className="overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-cyan-200/50">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* User's Photo Section (Left) */}
                <div className="p-8 bg-gray-50 flex flex-col justify-center items-center">
                  <img
                    src={previewUrl || capturedImage || ''}
                    alt={t('dashboard.result.yourPhoto')}
                    className="w-64 h-64 rounded-full object-cover shadow-lg border-4 border-white"
                  />
                  <h3 className="mt-6 text-2xl font-bold text-gray-800">{t('dashboard.result.yourPhoto')}</h3>
                </div>

                {/* Spirit Animal Section (Right) */}
                <div 
                  className="p-12 text-white flex flex-col justify-center items-center relative bg-no-repeat bg-cover bg-center"
                  style={{ backgroundImage: `url(${spiritAnimalResult.imageUrl})` }}
                >
                  {/* Overlay for text readability */}
                  <div className="absolute inset-0 bg-black/50"></div>
                  
                  <div className="relative z-10 text-center">
                    <Sparkles className="w-16 h-16 mb-4 opacity-80 mx-auto" />
                    <h2 className="text-5xl font-extrabold tracking-tight">{spiritAnimalResult.animal}</h2>
                    <p className="mt-4 text-lg text-gray-200 italic">"{spiritAnimalResult.reason}"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8">
            <Button
              onClick={() => {
                setUploadMode('upload');
                handleRemoveFile();
                setSpiritAnimalResult(null);
              }}
              variant="outline"
              size="lg"
              className="bg-white"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              {t('dashboard.result.tryAnother')}
            </Button>
          </div>
        </div>
      );
    }
    
    // Default to upload/webcam UI, which is identical to celebrity section for now
    // We can reuse renderCelebritySection but change the text inside
    // For simplicity, let's just reuse it directly and handle text via translation keys
    // A better approach for the future would be to abstract the upload UI into its own component.
    return renderCelebritySection();
  }

  const renderColorSection = () => {
    if (uploadMode === 'results' && colorResult) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <Palette className="w-12 h-12 text-pink-500 mb-4" />
                <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">{colorResult.mood_name}</h2>
                <p className="mt-4 text-gray-600 text-lg">{colorResult.description}</p>
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-700 mb-3">Dominant Colors:</h4>
                  <div className="flex space-x-3">
                    {colorResult.palette.map((color, index) => (
                      <div key={index} className="w-16 h-16 rounded-full shadow-inner border-2 border-white" style={{ backgroundColor: color }} title={color} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="min-h-[300px] md:min-h-0">
                <img
                  src={previewUrl || capturedImage || ''}
                  alt="Analyzed"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
           <div className="mt-8 text-center">
            <Button
              onClick={() => {
                setUploadMode('upload');
                handleRemoveFile();
                setColorResult(null);
              }}
              variant="outline"
              size="lg"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              {t('dashboard.result.tryAnother')}
            </Button>
          </div>
        </div>
      );
    }
    return renderCelebritySection();
  };

  const renderCelebritySection = () => {
    const isAnimalSection = activeSection === 'animal';
    const isColorSection = activeSection === 'color';

    if (uploadMode === 'upload') {
      return (
        <div className="max-w-4xl mx-auto">
          {/* Main Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {isAnimalSection 
                ? t('dashboard.animal.header') 
                : isColorSection 
                ? t('dashboard.color.header')
                : t('dashboard.celebrity.header')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isAnimalSection 
                ? t('dashboard.animal.subheader') 
                : isColorSection
                ? t('dashboard.color.subheader')
                : t('dashboard.celebrity.subheader')}
            </p>
          </div>

          {/* Main Upload Component */}
          <Card
            className={`w-full transition-all duration-300 ${
              isDragging ? 'border-violet-500 shadow-2xl scale-105' : 'border-gray-200 shadow-lg'
            }`}
          >
            <CardContent className="p-0">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className="grid grid-cols-1 lg:grid-cols-2 min-h-[450px]"
              >
                {/* Left side - Upload Instructions & Preview */}
                <div className="p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-l-lg">
                  {previewUrl ? (
                    <div className="relative w-full max-w-xs">
                      <img
                        src={previewUrl}
                        alt="Your Upload"
                        className="w-full h-auto object-cover rounded-xl shadow-md mb-4"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className="absolute -top-3 -right-3 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 shadow-lg border-2 border-white"
                        aria-label="Remove photo"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {uploadedFile?.name || t('dashboard.result.yourPhoto')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mb-6 border-4 border-violet-200">
                        <Upload className="w-12 h-12 text-violet-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {isDragging ? t('dashboard.celebrity.dropIt') : t('dashboard.celebrity.uploadPhoto')}
                      </h3>
                      <p className="text-gray-600">
                        {t('dashboard.celebrity.dragDrop')}
                      </p>
                    </>
                  )}
                </div>

                {/* Right side - Actions & Guidelines */}
                <div className="p-8 flex flex-col justify-center bg-white rounded-r-lg">
                  {/* Action Buttons */}
                  <div className="w-full space-y-4 mb-8">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-16 bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
                      disabled={isProcessing}
                    >
                      <Upload className="w-6 h-6 mr-3" />
                      {t('dashboard.celebrity.choosePhoto')}
                    </Button>
                    <Button
                      onClick={handleUseWebcam}
                      className="w-full h-16 border-2 border-gray-300 bg-white hover:bg-gray-100 hover:border-violet-400 text-gray-700 hover:text-violet-600 text-lg font-semibold rounded-xl transition-all"
                      disabled={isProcessing}
                    >
                      <Camera className="w-6 h-6 mr-3" />
                      {t('dashboard.celebrity.useWebcam')}
                    </Button>
                  </div>

                  {/* Guidelines */}
                  <div className="p-6 bg-violet-100 rounded-xl border border-violet-200">
                    <h4 className="font-bold text-violet-900 mb-3 text-lg">{t('dashboard.celebrity.guidelinesTitle')}</h4>
                    <ul className="text-base text-violet-700 space-y-3">
                      <li className="flex items-center"><Check className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" /> {t('dashboard.celebrity.guidelineClear')}</li>
                      <li className="flex items-center"><Sun className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" /> {t('dashboard.celebrity.guidelineLighting')}</li>
                      <li className="flex items-center"><Users className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" /> {t('dashboard.celebrity.guidelineGroup')}</li>
                      <li className="flex items-center"><FileImage className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" /> {t('dashboard.celebrity.guidelineFormats')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Floating Upload Button */}
          {uploadedFile && (
            <div className="mt-8 text-center">
              <Button
                onClick={handleUploadPhoto}
                disabled={isProcessing}
                className="h-16 px-12 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    {t('dashboard.celebrity.analyzing')}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3" />
                    {isAnimalSection 
                      ? t('dashboard.animal.findAnimal') 
                      : isColorSection
                      ? t('dashboard.color.analyzeButton')
                      : t('dashboard.celebrity.findTwin')}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      );
    }

    if (uploadMode === 'webcam') {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Use Webcam</h2>
            <p className="text-gray-600">Position yourself in the frame and capture your photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Button
              onClick={() => {
                setUploadMode('upload');
                handleRemoveFile(); // Clear any previous selection
              }}
              variant="outline"
              className="h-20 border-2 border-gray-300 hover:border-violet-500 hover:text-violet-600 text-lg font-semibold rounded-2xl"
            >
              <ChevronLeft className="w-6 h-6 mr-3" />
              {t('dashboard.backToUpload')}
            </Button>
            <Button
              onClick={handleAnalyzeCapturedPhoto}
              disabled={isProcessing || !capturedImage}
              className="h-20 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-2xl disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-3" />
                  Analyze Photo
                </>
              )}
            </Button>
          </div>

          {/* React Webcam Component */}
          <div className="bg-black rounded-3xl aspect-video mb-6 relative overflow-hidden shadow-lg">
            <Webcam
              ref={webcamRef}
              audio={false}
              width={640}
              height={480}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "user"
              }}
              className="w-full h-full object-cover"
            />

            {/* Webcam Active Indicator */}
            {!capturedImage && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Camera Active</span>
                </div>
              </div>
            )}

            {/* Capture Preview */}
            {capturedImage && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="max-w-xl max-h-[400px] rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            {!capturedImage ? (
              <Button onClick={handleCapture} disabled={isProcessing} size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Camera className="w-6 h-6 mr-2" />
                Capture Photo
              </Button>
            ) : (
              <div className="flex justify-center gap-4">
                  <Button onClick={() => setCapturedImage(null)} variant="outline" size="lg">
                      <RefreshCw className="w-6 h-6 mr-2" />
                      Retake
                  </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    const currentMatch = celebrityMatches[currentMatchIndex];

    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">{t('dashboard.result.title')}</h2>
          </div>
          {celebrityMatches.length > 0 && (
            <div className="bg-teal-100 rounded-full px-4 py-2 text-sm font-medium text-teal-700">
              {currentMatchIndex + 1} / {celebrityMatches.length}
            </div>
          )}
        </div>

        {celebrityMatches.length > 0 && currentMatch ? (
            <>
              <CelebrityMatchCard
                celebrityName={currentMatch.name}
                similarity={currentMatch.similarity}
                userImage={previewUrl || capturedImage || ''}
                onNext={() => handleNavigateMatch('next')}
                onPrev={() => handleNavigateMatch('prev')}
                isNextDisabled={currentMatchIndex === celebrityMatches.length - 1}
                isPrevDisabled={currentMatchIndex === 0}
                currentMatchIndex={currentMatchIndex}
                totalMatches={celebrityMatches.length}
              />
              <div className="text-center mt-6">
                <Button
                  onClick={() => {
                    setUploadMode('upload');
                    handleRemoveFile();
                    setCelebrityMatches([]);
                  }}
                  variant="outline"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t('dashboard.result.tryAnother')}
                </Button>
              </div>
            </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">Your match will appear here.</p>
          </div>
        )}
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'celebrity':
        return renderCelebritySection();
      case 'animal':
        return renderAnimalSection();
      case 'color':
        return renderColorSection();
      case 'personality':
        return <MBTIQuiz />;
      case 'analytics':
        return (
          <div className="max-w-4xl mx-auto text-center">
            <BarChart3 className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('dashboard.analytics.header')}</h2>
            <p className="text-gray-600 mb-8">{t('dashboard.analytics.subheader')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">12</h3>
                  <p className="text-gray-600">{t('dashboard.analytics.totalAnalyses')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">87%</h3>
                  <p className="text-gray-600">{t('dashboard.analytics.bestMatch')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">4</h3>
                  <p className="text-gray-600">{t('dashboard.analytics.categoriesUsed')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto text-center">
            <Settings className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('dashboard.settings.header')}</h2>
            <p className="text-gray-600 mb-8">{t('dashboard.settings.subheader')}</p>
            <div className="space-y-4 text-left">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{t('dashboard.settings.privacyTitle')}</h3>
                  <p className="text-gray-600">{t('dashboard.settings.privacyDesc')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{t('dashboard.settings.notificationsTitle')}</h3>
                  <p className="text-gray-600">{t('dashboard.settings.notificationsDesc')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return renderCelebritySection();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30
          bg-white
          transition-all duration-300 ease-in-out
          lg:relative
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col border-r border-gray-200 max-h-screen
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center p-4 h-16 border-b border-gray-200 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center">
            <img
              src={logoOnly}
              alt="Alternity Logo"
              className="h-7"
            />
            {isSidebarOpen && (
              <span className="ml-2 text-xl text-gray-900 font-fredoka">alternity</span>
            )}
          </div>
          {isSidebarOpen && (
            <Button
              onClick={() => setIsSidebarOpen(false)}
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 p-4 mt-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id as DashboardSection)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${!isSidebarOpen ? 'justify-center' : ''}`}
                  title={isSidebarOpen ? '' : item.label}
                >
                  <Icon className={`w-6 h-6 ${isSidebarOpen ? 'mr-3' : ''}`} />
                  {isSidebarOpen && <span className="font-semibold">{item.label}</span>}
                </button>
              );
            })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}>
                <img
                  src={user?.imageUrl}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
              {isSidebarOpen && (
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-base text-gray-800 truncate">{user?.fullName}</h3>
                  <p className="text-sm text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              )}
            </div>
          {isSidebarOpen && (
            <div className="mt-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t('dashboard.backToHome')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Top Navbar for Dashboard */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 h-16 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900">
              {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <div className="text-md text-gray-500">
              {t('dashboard.welcomeBack', { name: user?.firstName || user?.fullName || 'User' })}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
} 