'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Palette, 
  Eye, 
  Download, 
  Share2, 
  Heart, 
  Settings, 
  User, 
  CreditCard, 
  Sparkles, 
  RotateCcw, 
  Save, 
  Globe, 
  Crown,
  Zap,
  Brush,
  Home,
  Building,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Star,
  Play
} from 'lucide-react';

interface ColorPalette {
  id: string;
  name: string;
  hex: string;
  brand?: string;
  category: string;
}

interface Project {
  id: string;
  name: string;
  originalImage: string;
  modifiedImage: string;
  colors: string[];
  createdAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  freeUsesLeft: number;
  language: 'en' | 'pt';
}

const JRibeiroPaintVisualizer = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'home' | 'editor' | 'library' | 'settings' | 'payment'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modifiedImage, setModifiedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [language, setLanguage] = useState<'en' | 'pt'>('en');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations = {
    en: {
      appName: "JRibeiro Paint Visualizer",
      tagline: "Transform your space with AI-powered color visualization",
      login: "Sign In",
      loginWith: "Continue with",
      google: "Google",
      apple: "Apple",
      email: "Email",
      getStarted: "Get Started",
      home: "Home",
      editor: "Editor",
      library: "Library",
      settings: "Settings",
      uploadPhoto: "Upload Photo",
      takePhoto: "Take Photo",
      selectColor: "Select Color",
      applyColor: "Apply Color",
      processing: "Processing with AI...",
      beforeAfter: "Before / After",
      saveProject: "Save Project",
      shareProject: "Share Project",
      downloadHD: "Download HD",
      favoriteColors: "Favorite Colors",
      colorSuggestions: "AI Color Suggestions",
      freeTrialLeft: "Free trial uses left",
      upgradePremium: "Upgrade to Premium",
      premiumFeatures: "Premium Features",
      unlimitedUse: "Unlimited photo processing",
      hdDownloads: "HD downloads with logo",
      aiSuggestions: "Advanced AI suggestions",
      colorLibrary: "Professional color library",
      projectHistory: "Project history",
      priority: "Priority support",
      monthlyPlan: "$5.99/month",
      yearlyPlan: "$59.99/year (Save 17%)",
      startFreeTrial: "Start Free Trial",
      language: "Language",
      account: "Account",
      billing: "Billing",
      support: "Support",
      logout: "Logout",
      sherwinWilliams: "Sherwin-Williams",
      benjaminMoore: "Benjamin Moore",
      pantone: "Pantone",
      custom: "Custom RGB"
    },
    pt: {
      appName: "JRibeiro Paint Visualizer",
      tagline: "Transforme seu espaço com visualização de cores por IA",
      login: "Entrar",
      loginWith: "Continuar com",
      google: "Google",
      apple: "Apple",
      email: "Email",
      getStarted: "Começar",
      home: "Início",
      editor: "Editor",
      library: "Biblioteca",
      settings: "Configurações",
      uploadPhoto: "Enviar Foto",
      takePhoto: "Tirar Foto",
      selectColor: "Selecionar Cor",
      applyColor: "Aplicar Cor",
      processing: "Processando com IA...",
      beforeAfter: "Antes / Depois",
      saveProject: "Salvar Projeto",
      shareProject: "Compartilhar Projeto",
      downloadHD: "Download HD",
      favoriteColors: "Cores Favoritas",
      colorSuggestions: "Sugestões de Cores IA",
      freeTrialLeft: "Usos gratuitos restantes",
      upgradePremium: "Upgrade Premium",
      premiumFeatures: "Recursos Premium",
      unlimitedUse: "Processamento ilimitado de fotos",
      hdDownloads: "Downloads HD com logo",
      aiSuggestions: "Sugestões avançadas de IA",
      colorLibrary: "Biblioteca de cores profissional",
      projectHistory: "Histórico de projetos",
      priority: "Suporte prioritário",
      monthlyPlan: "$5,99/mês",
      yearlyPlan: "$59,99/ano (Economize 17%)",
      startFreeTrial: "Iniciar Teste Grátis",
      language: "Idioma",
      account: "Conta",
      billing: "Cobrança",
      support: "Suporte",
      logout: "Sair",
      sherwinWilliams: "Sherwin-Williams",
      benjaminMoore: "Benjamin Moore",
      pantone: "Pantone",
      custom: "RGB Personalizado"
    }
  };

  const t = translations[language];

  const colorPalettes: ColorPalette[] = [
    // Sherwin-Williams
    { id: 'sw1', name: 'Naval', hex: '#1B2951', brand: 'Sherwin-Williams', category: 'blues' },
    { id: 'sw2', name: 'Agreeable Gray', hex: '#D0CFC0', brand: 'Sherwin-Williams', category: 'grays' },
    { id: 'sw3', name: 'Accessible Beige', hex: '#D6C8B5', brand: 'Sherwin-Williams', category: 'beiges' },
    { id: 'sw4', name: 'Pure White', hex: '#FFFFFF', brand: 'Sherwin-Williams', category: 'whites' },
    
    // Benjamin Moore
    { id: 'bm1', name: 'Hale Navy', hex: '#2C3E50', brand: 'Benjamin Moore', category: 'blues' },
    { id: 'bm2', name: 'Classic Gray', hex: '#A8A8A8', brand: 'Benjamin Moore', category: 'grays' },
    { id: 'bm3', name: 'White Dove', hex: '#F8F8F0', brand: 'Benjamin Moore', category: 'whites' },
    { id: 'bm4', name: 'Revere Pewter', hex: '#B8B5A8', brand: 'Benjamin Moore', category: 'grays' },
    
    // Pantone
    { id: 'p1', name: 'Classic Blue', hex: '#0F4C75', brand: 'Pantone', category: 'blues' },
    { id: 'p2', name: 'Living Coral', hex: '#FF6B6B', brand: 'Pantone', category: 'corals' },
    { id: 'p3', name: 'Greenery', hex: '#88B04B', brand: 'Pantone', category: 'greens' },
    { id: 'p4', name: 'Ultra Violet', hex: '#6B5B95', brand: 'Pantone', category: 'purples' },
  ];

  const aiSuggestions = [
    { name: 'Warm Neutral', hex: '#E8DCC0', reason: 'Complements natural lighting' },
    { name: 'Soft Blue', hex: '#A8DADC', reason: 'Creates calming atmosphere' },
    { name: 'Sage Green', hex: '#B7C4A7', reason: 'Brings nature indoors' },
    { name: 'Warm Gray', hex: '#C8B8A1', reason: 'Timeless and versatile' },
  ];

  useEffect(() => {
    // Simulate user login
    const mockUser: User = {
      id: '1',
      name: 'John Contractor',
      email: 'john@example.com',
      isPremium: false,
      freeUsesLeft: 1,
      language: 'en'
    };
    setUser(mockUser);
  }, []);

  const handleLogin = (provider: string) => {
    const mockUser: User = {
      id: '1',
      name: provider === 'google' ? 'John Contractor' : 'Jane Professional',
      email: provider === 'google' ? 'john@gmail.com' : 'jane@icloud.com',
      isPremium: false,
      freeUsesLeft: 1,
      language: language
    };
    setUser(mockUser);
    setCurrentScreen('home');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setCurrentScreen('editor');
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIProcessing = async () => {
    if (!selectedImage || !user) return;
    
    if (!user.isPremium && user.freeUsesLeft <= 0) {
      setCurrentScreen('payment');
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create a modified version (in real app, this would be AI-processed)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      // Apply color overlay effect (simplified simulation)
      if (ctx) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = selectedColor + '40'; // Add transparency
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      setModifiedImage(canvas.toDataURL());
      
      // Update user's free uses
      if (!user.isPremium) {
        setUser(prev => prev ? { ...prev, freeUsesLeft: prev.freeUsesLeft - 1 } : null);
      }
    };
    
    img.src = selectedImage;
    setIsProcessing(false);
  };

  const toggleFavoriteColor = (color: string) => {
    setFavoriteColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const saveProject = () => {
    if (!selectedImage || !modifiedImage) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: `Project ${projects.length + 1}`,
      originalImage: selectedImage,
      modifiedImage: modifiedImage,
      colors: [selectedColor],
      createdAt: new Date()
    };
    
    setProjects(prev => [newProject, ...prev]);
  };

  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Brush className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.appName}</h1>
          <p className="text-gray-600 text-sm px-4">{t.tagline}</p>
          <div className="mt-4 text-xs text-gray-500">
            Powered by JRIBEIRO Painting Corp
          </div>
        </div>

        {/* Login Options */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <button
            onClick={() => handleLogin('google')}
            className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 rounded-xl py-3 px-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <span className="text-gray-700 font-medium">{t.loginWith} {t.google}</span>
          </button>

          <button
            onClick={() => handleLogin('apple')}
            className="w-full flex items-center justify-center space-x-3 bg-black text-white rounded-xl py-3 px-4 hover:bg-gray-800 transition-all duration-200"
          >
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-black text-xs font-bold">🍎</span>
            </div>
            <span className="font-medium">{t.loginWith} {t.apple}</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={() => handleLogin('email')}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 px-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">{t.loginWith} {t.email}</span>
          </button>
        </div>

        {/* Language Toggle */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">{language === 'en' ? 'Português' : 'English'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Brush className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t.appName}</h1>
                <p className="text-xs text-gray-500">JRIBEIRO Painting Corp</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!user?.isPremium && (
                <div className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  <Zap className="w-4 h-4" />
                  <span>{t.freeTrialLeft}: {user?.freeUsesLeft}</span>
                </div>
              )}
              <button
                onClick={() => setCurrentScreen('settings')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform any space with AI-powered color visualization. Upload a photo and see how different paint colors will look in real-time.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{t.uploadPhoto}</h3>
                <p className="text-gray-600">Choose an image from your device</p>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 px-6 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              {t.uploadPhoto}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{t.takePhoto}</h3>
                <p className="text-gray-600">Capture a new photo with your camera</p>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl py-3 px-6 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
            >
              {t.takePhoto}
            </button>
          </div>
        </div>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Projects</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={project.modifiedImage}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{project.name}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {project.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {project.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Upgrade */}
        {!user?.isPremium && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white text-center">
            <Crown className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">{t.upgradePremium}</h3>
            <p className="mb-6 opacity-90">
              Unlock unlimited photo processing, HD downloads, and advanced AI features
            </p>
            <button
              onClick={() => setCurrentScreen('payment')}
              className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              {t.startFreeTrial}
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );

  const EditorScreen = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentScreen('home')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Paint Editor</h1>
            </div>
            <div className="flex items-center space-x-2">
              {modifiedImage && (
                <>
                  <button
                    onClick={saveProject}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{t.saveProject}</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>{t.shareProject}</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>{t.downloadHD}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Image Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                {modifiedImage && (
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{t.beforeAfter}</span>
                  </button>
                )}
              </div>
              
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
                {selectedImage && (
                  <>
                    <img
                      src={showComparison ? selectedImage : (modifiedImage || selectedImage)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-6 text-center">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-900 font-medium">{t.processing}</p>
                        </div>
                      </div>
                    )}
                    {showComparison && modifiedImage && (
                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                        {showComparison ? 'Before' : 'After'}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Color Tools */}
          <div className="space-y-6">
            {/* Color Picker */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.selectColor}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={simulateAIProcessing}
                  disabled={isProcessing || !selectedImage}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 px-6 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t.applyColor}</span>
                </button>
              </div>
            </div>

            {/* Professional Colors */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Colors</h3>
              
              <div className="space-y-4">
                {['Sherwin-Williams', 'Benjamin Moore', 'Pantone'].map((brand) => (
                  <div key={brand}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{brand}</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {colorPalettes
                        .filter(color => color.brand === brand)
                        .map((color) => (
                          <button
                            key={color.id}
                            onClick={() => setSelectedColor(color.hex)}
                            className="group relative"
                          >
                            <div
                              className="w-full aspect-square rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                              <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                {color.name}
                              </span>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.colorSuggestions}</h3>
              
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(suggestion.hex)}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-lg border border-gray-200"
                      style={{ backgroundColor: suggestion.hex }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{suggestion.name}</div>
                      <div className="text-sm text-gray-500">{suggestion.reason}</div>
                    </div>
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PaymentScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <Crown className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.upgradePremium}</h1>
          <p className="text-gray-600">Unlock the full power of AI-driven paint visualization</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Features */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t.premiumFeatures}</h3>
            
            <div className="space-y-4">
              {[
                { icon: Zap, text: t.unlimitedUse },
                { icon: Download, text: t.hdDownloads },
                { icon: Sparkles, text: t.aiSuggestions },
                { icon: Palette, text: t.colorLibrary },
                { icon: Save, text: t.projectHistory },
                { icon: Star, text: t.priority }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
              <div className="text-center mb-6">
                <h4 className="text-lg font-bold text-gray-900">Monthly Plan</h4>
                <div className="text-3xl font-bold text-purple-600 mt-2">{t.monthlyPlan}</div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl py-4 px-6 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg font-semibold">
                {t.startFreeTrial}
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                SAVE 17%
              </div>
              
              <div className="text-center mb-6">
                <h4 className="text-lg font-bold">Yearly Plan</h4>
                <div className="text-3xl font-bold mt-2">{t.yearlyPlan}</div>
              </div>
              
              <button className="w-full bg-white text-purple-600 rounded-xl py-4 px-6 hover:bg-gray-100 transition-colors font-semibold">
                {t.startFreeTrial}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentScreen('home')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Continue with free trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsScreen = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">{t.settings}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Account */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.account}</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
                {user?.isPremium && (
                  <div className="flex items-center space-x-1 text-purple-600 text-sm">
                    <Crown className="w-4 h-4" />
                    <span>Premium Member</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.language}</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Current Language</span>
              <button
                onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'en' ? 'English' : 'Português'}</span>
              </button>
            </div>
          </div>

          {/* Billing */}
          {!user?.isPremium && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.billing}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Free Plan</div>
                  <div className="text-sm text-gray-500">{t.freeTrialLeft}: {user?.freeUsesLeft}</div>
                </div>
                <button
                  onClick={() => setCurrentScreen('payment')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
                >
                  {t.upgradePremium}
                </button>
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <button
              onClick={() => {
                setUser(null);
                setCurrentScreen('login');
              }}
              className="w-full flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 py-3 px-4 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user && currentScreen !== 'login') {
    return <LoginScreen />;
  }

  switch (currentScreen) {
    case 'login':
      return <LoginScreen />;
    case 'home':
      return <HomeScreen />;
    case 'editor':
      return <EditorScreen />;
    case 'payment':
      return <PaymentScreen />;
    case 'settings':
      return <SettingsScreen />;
    default:
      return <HomeScreen />;
  }
};

export default JRibeiroPaintVisualizer;