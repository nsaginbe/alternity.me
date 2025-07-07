import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { resizeImageFromDataUrl, dataUrlToFile } from '@/lib/utils';
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
  MenuIcon
} from 'lucide-react';

type DashboardSection = 'celebrity' | 'animal' | 'color' | 'gender' | 'analytics' | 'settings';

interface CelebrityMatch {
  name: string;
  similarity: number;
}

interface ApiResponse extends Array<CelebrityMatch> {}



// Development Badge Component (less intrusive)
const DevelopmentBadge = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      {children}
      
      {/* Small development badge in top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-amber-100 border border-amber-300 rounded-full px-3 py-1 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-amber-700">COMING SOON</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<DashboardSection>('celebrity');

  const [uploadMode, setUploadMode] = useState<'upload' | 'webcam' | 'results'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default for mobile
  const [celebrityMatches, setCelebrityMatches] = useState<CelebrityMatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  // Handle URL parameters for direct section navigation
  useEffect(() => {
    const section = searchParams.get('section') as DashboardSection;
    if (section && ['celebrity', 'animal', 'color', 'gender', 'analytics', 'settings'].includes(section)) {
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

  // Call celebrity lookalike API
  const findCelebLookalike = async (base64ImageData: string): Promise<ApiResponse> => {
    console.log('🚀 Starting API call to localhost:5000/find');
    console.log('📦 Base64 data length:', base64ImageData.length);
    
    try {
      const response = await fetch('http://localhost:5000/find', {
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
        throw new Error('Cannot connect to API server. Please ensure the backend is running on localhost:5000');
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
  const capture = useCallback(async () => {
    console.log('📷 Capturing photo with react-webcam...');
    
    if (!webcamRef.current) {
      console.error('❌ Webcam ref not available');
      setApiError('Camera not available. Please try again.');
      return;
    }

    try {
      setIsProcessing(true);
      setApiError(null);

      // Get screenshot from webcam
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (!imageSrc) {
        console.error('❌ Failed to capture screenshot');
        setApiError('Failed to capture photo. Please try again.');
        return;
      }

      console.log('✅ Screenshot captured, resizing...');
      
      // Resize image for optimization
      const resizedImage = await resizeImageFromDataUrl(imageSrc, 512, 0.9);
      setCapturedImage(resizedImage);
      
      // Convert to File for API processing
      const capturedFile = dataUrlToFile(resizedImage, 'webcam-capture.jpg');
      setUploadedFile(capturedFile);
      
      console.log('🔄 Processing captured image...');
      
      // Process the captured image immediately
      const base64Data = await convertImageToBase64(capturedFile);
      const matches = await findCelebLookalike(base64Data);
      setCelebrityMatches(matches);
      setCurrentMatchIndex(0);
      setUploadMode('results');
      
      console.log('✅ Webcam capture and processing completed!');
    } catch (error) {
      console.error('❌ Error processing webcam image:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to process image. Please try again.');
      setUploadMode('upload'); // Go back to upload mode on error
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const sidebarItems = [
    { id: 'celebrity', label: 'Celebrity Match', icon: Star, color: 'text-yellow-600' },
    { id: 'animal', label: 'Spirit Animal', icon: Sparkles, color: 'text-emerald-600' },
    { id: 'color', label: 'Color Analysis', icon: Palette, color: 'text-pink-600' },
    { id: 'gender', label: 'Gender Analysis', icon: Eye, color: 'text-blue-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-indigo-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' }
  ];

  const handleSectionChange = (section: DashboardSection) => {
    setActiveSection(section);
    setSearchParams({ section });
  };

  const handleNavigateMatch = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentMatchIndex > 0) {
      setCurrentMatchIndex(currentMatchIndex - 1);
    } else if (direction === 'next' && currentMatchIndex < celebrityMatches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    }
  };



  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (uploadedFile) {
      console.log('📁 Starting photo upload and processing...', uploadedFile.name);
      setIsProcessing(true);
      setApiError(null);
      
      try {
        console.log('🔄 Step 1: Converting to base64...');
        const base64Data = await convertImageToBase64(uploadedFile);
        
        console.log('🔄 Step 2: Calling Celebrity Match API...');
        const matches = await findCelebLookalike(base64Data);
        
        console.log('🔄 Step 3: Processing results...');
        setCelebrityMatches(matches);
        setCurrentMatchIndex(0);
        setUploadMode('results');
        
        console.log('✅ Celebrity match completed successfully!');
      } catch (error) {
        console.error('❌ Error processing image:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to process image. Please try again.');
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
    setApiError(null);
    setCapturedImage(null);
  };

  const handleCapturePhoto = () => {
    console.log('🎥 Capture photo button clicked');
    capture();
  };

  const renderCelebritySection = () => {
    if (uploadMode === 'upload') {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Celebrity Match</h2>
            <p className="text-gray-600">Upload your photo to find your celebrity doppelganger</p>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">For best results:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Upload a clear, high-quality photo</li>
                <li>• Face should be well-lit and facing forward</li>
                <li>• Avoid group photos - single person works best</li>
                <li>• Supported formats: JPG, PNG, WebP (Max 5MB)</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Button
              onClick={handleUploadPhoto}
              disabled={isProcessing}
              className="h-20 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-2xl disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 mr-3" />
                  Upload photo
                </>
              )}
            </Button>
            <Button
              onClick={handleUseWebcam}
              disabled={isProcessing}
              variant="outline"
              className="h-20 border-2 border-gray-300 hover:border-purple-500 hover:text-purple-600 text-lg font-semibold rounded-2xl disabled:opacity-50"
            >
              <Camera className="w-6 h-6 mr-3" />
              Use webcam
            </Button>
          </div>

          {/* Error Display */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <X className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="text-red-800 font-semibold">Error</h4>
                  <p className="text-red-600 text-sm">{apiError}</p>
                </div>
                <button
                  onClick={() => setApiError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-200 ${
              isDragging 
                ? 'border-emerald-500 bg-emerald-50' 
                : uploadedFile 
                  ? 'border-emerald-300 bg-emerald-50' 
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-40 h-40 object-cover rounded-xl mx-auto mb-4"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Photo Ready!</h3>
                <p className="text-emerald-600 mb-4">Click "Upload photo" to analyze</p>
                <p className="text-sm text-gray-500">{uploadedFile?.name}</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-gray-200 rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isDragging ? 'Drop your photo here' : 'Upload your photo'}
                </h3>
                <p className="text-gray-600 mb-4">Drag and drop or click to select</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, WebP (Max 5MB)</p>
              </>
            )}
          </div>
        </div>
      );
    }

    if (uploadMode === 'webcam') {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Use Webcam</h2>
            <p className="text-gray-600">Position yourself in the frame and capture your photo</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Tips for better results:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure good lighting on your face</li>
                <li>• Look directly at the camera</li>
                <li>• Remove sunglasses or hat if possible</li>
                <li>• Make sure your face is clearly visible</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Button
              onClick={() => setUploadMode('upload')}
              variant="outline"
              className="h-20 border-2 border-gray-300 text-lg font-semibold rounded-2xl"
            >
              <Upload className="w-6 h-6 mr-3" />
              Upload photo
            </Button>
            <Button
              onClick={() => setUploadMode('upload')}
              className="h-20 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-2xl"
            >
              <Camera className="w-6 h-6 mr-3" />
              Back to upload
            </Button>
          </div>

          {/* React Webcam Component */}
          <div className="bg-black rounded-3xl aspect-video mb-6 relative overflow-hidden">
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
            <div className="absolute top-4 left-4">
              <div className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Camera Active</span>
              </div>
            </div>

            {/* Capture Preview */}
            {capturedImage && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="max-w-xs max-h-60 rounded-lg"
                  />
                  <p className="text-white">Photo captured! Processing...</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center space-y-4">
            <div className="space-y-3">
              <Button
                onClick={handleCapturePhoto}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Capture photo
                  </>
                )}
              </Button>
              <div className="text-xs text-gray-500">
                Camera is ready • Click to take photo and analyze
              </div>
            </div>
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
            <h2 className="text-3xl font-bold text-gray-900">Your Celebrity Match</h2>
          </div>
          {celebrityMatches.length > 0 && (
            <div className="bg-teal-100 rounded-full px-4 py-2 text-sm font-medium text-teal-700">
              {currentMatchIndex + 1} / {celebrityMatches.length}
            </div>
          )}
        </div>

        {celebrityMatches.length > 0 && currentMatch ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Your Photo */}
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="bg-blue-100 rounded-xl py-2 px-4 mb-4 inline-block">
                    <span className="text-blue-700 font-semibold">YOU</span>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-48 h-48 bg-gray-200 rounded-2xl mx-auto mb-4 overflow-hidden">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Your uploaded photo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Photo</h3>
                  <p className="text-gray-600 text-sm mb-4">Original for comparison</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600">Reference Image</p>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center space-y-4">
                <Button
                  onClick={() => handleNavigateMatch('prev')}
                  disabled={currentMatchIndex === 0}
                  variant="outline"
                  size="sm"
                  className="rounded-full p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Navigate</p>
                  <p className="text-sm text-gray-500">matches</p>
                </div>
                <Button
                  onClick={() => handleNavigateMatch('next')}
                  disabled={currentMatchIndex === celebrityMatches.length - 1}
                  variant="outline"
                  size="sm"
                  className="rounded-full p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Celebrity Match */}
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="bg-yellow-100 rounded-xl py-2 px-4 mb-4 inline-block">
                    <span className="text-yellow-700 font-semibold">
                      #{currentMatchIndex + 1} MATCH • {Math.round(currentMatch.similarity * 100)}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`w-48 h-48 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                    currentMatchIndex % 4 === 0 ? 'bg-gradient-to-br from-green-400 to-green-600' :
                    currentMatchIndex % 4 === 1 ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                    currentMatchIndex % 4 === 2 ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                    'bg-gradient-to-br from-pink-400 to-pink-600'
                  }`}>
                    <span className="text-6xl font-bold text-white">
                      {currentMatch.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentMatch.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">Celebrity match</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentMatchIndex % 4 === 0 ? 'bg-green-500' :
                        currentMatchIndex % 4 === 1 ? 'bg-blue-500' :
                        currentMatchIndex % 4 === 2 ? 'bg-purple-500' :
                        'bg-pink-500'
                      }`}
                      style={{ width: `${currentMatch.similarity * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">Similarity Score</p>
                </CardContent>
              </Card>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2 mb-6">
              {celebrityMatches.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMatchIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentMatchIndex ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <p className="text-center text-gray-600 text-sm mb-8">
              Use navigation arrows or click dots to compare matches
            </p>
          </>
        ) : (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No celebrity matches found. Upload a photo to get started!</p>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={() => {
              setUploadMode('upload');
              setUploadedFile(null);
              setCelebrityMatches([]);
              setApiError(null);
              setCurrentMatchIndex(0);
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-2xl text-lg font-semibold"
          >
            <Upload className="w-5 h-5 mr-2" />
            Try Another Photo
          </Button>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'celebrity':
        return renderCelebritySection();
      case 'animal':
        return (
          <DevelopmentBadge>
            <div className="max-w-4xl mx-auto text-center">
              <Sparkles className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Spirit Animal Analysis</h2>
              <p className="text-gray-600 mb-8">Discover your inner animal spirit through AI analysis</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </DevelopmentBadge>
        );
      case 'color':
        return (
          <DevelopmentBadge>
            <div className="max-w-4xl mx-auto text-center">
              <Palette className="w-16 h-16 text-pink-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Color Analysis</h2>
              <p className="text-gray-600 mb-8">Find your perfect color palette and seasonal type</p>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Analyze Colors
              </Button>
            </div>
          </DevelopmentBadge>
        );
      case 'gender':
        return (
          <DevelopmentBadge>
            <div className="max-w-4xl mx-auto text-center">
              <Eye className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Gender Analysis</h2>
              <p className="text-gray-600 mb-8">Advanced facial feature analysis and gender prediction</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Start Analysis
              </Button>
            </div>
          </DevelopmentBadge>
        );
      case 'analytics':
        return (
          <DevelopmentBadge>
            <div className="max-w-4xl mx-auto text-center">
              <BarChart3 className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
              <p className="text-gray-600 mb-8">View your analysis history and insights</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                    <p className="text-gray-600">Total Analyses</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900">87%</h3>
                    <p className="text-gray-600">Best Match Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900">4</h3>
                    <p className="text-gray-600">Categories Used</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DevelopmentBadge>
        );
      case 'settings':
        return (
          <DevelopmentBadge>
            <div className="max-w-4xl mx-auto text-center">
              <Settings className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600 mb-8">Manage your account and preferences</p>
              <div className="space-y-4 text-left">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Privacy Settings</h3>
                    <p className="text-gray-600">Control how your data is used and stored</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Notification Preferences</h3>
                    <p className="text-gray-600">Choose how you want to be notified</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DevelopmentBadge>
        );
      default:
        return renderCelebritySection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
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
      <div className={`bg-white shadow-xl flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'w-80' : 'w-20'
      } ${
        // Mobile: show as overlay, Desktop: always visible
        'lg:relative fixed lg:translate-x-0 z-40 h-full lg:h-auto'
      } ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Navigation Items */}
        <div className="flex-1 pt-6 pb-6">
          <div className="px-6 mb-8">
            {isSidebarOpen ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <Button
                    onClick={() => setIsSidebarOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-600">Discover your alternities</p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-crimson to-red-600 rounded-lg mb-3"></div>
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex text-gray-500 hover:text-gray-700 p-1"
                  title="Expand Sidebar"
                >
                  <MenuIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          
          <nav className="space-y-2 px-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id as DashboardSection)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-crimson to-red-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${!isSidebarOpen ? 'justify-center' : ''}`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''} ${isActive ? 'text-white' : item.color}`} />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info */}
        <div className="p-6 border-t border-gray-200">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-crimson to-red-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">john@example.com</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  // Clear auth state and redirect to home
                  localStorage.removeItem('user');
                  localStorage.removeItem('isAuthenticated');
                  window.location.href = '/';
                }}
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-gradient-to-r from-crimson to-red-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('isAuthenticated');
                  window.location.href = '/';
                }}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Top Navbar for Dashboard */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
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
            <div className="text-sm text-gray-500">
              Welcome back, John
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
} 