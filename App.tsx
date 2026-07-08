import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  Eye, EyeOff, ChevronDown, Calendar, Clock, User, Star, Phone, Mail,
  Lock, ArrowRight, CheckCircle, AlertCircle, Volume2, VolumeX,
  Video, PhoneCall, Send, Mic, MicOff, VideoOff,
  CreditCard, Wallet, Scissors,
  Home, LogOut, Bell, Menu, X, ChevronLeft, ChevronRight, Plus, Check,
  ShoppingCart, MapPin, Navigation, Shirt, Pill,
  Store, Trash2, Compass, Image, Monitor, Radio, Headphones,
  Stethoscope, Sun, Moon, Settings, Users, Save, Upload,
  Mail as MailIcon, MessageSquare, Send as SendIcon, Building
} from 'lucide-react';

// Alias for medical icon
const Medical = Stethoscope;

// ==================== THEME CONTEXT ====================
interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

const useTheme = () => useContext(ThemeContext);

// ==================== BRAND CONFIG CONTEXT ====================
interface BrandConfig {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  pricingTiers: { name: string; price: number; features: string[] }[];
}

interface BrandContextType {
  config: BrandConfig;
  updateConfig: (updates: Partial<BrandConfig>) => void;
}

const defaultBrand: BrandConfig = {
  companyName: 'Meridian',
  logoUrl: '',
  primaryColor: '#00d4ff',
  pricingTiers: [
    { name: 'Free', price: 0, features: ['Up to 5 appointments/month', 'Basic calendar', 'Email support'] },
    { name: 'Pro', price: 29, features: ['Unlimited appointments', 'Priority booking', 'Advanced analytics', 'SMS reminders'] },
    { name: 'Enterprise', price: 99, features: ['Everything in Pro', 'Multi-location', 'Team management', 'API access', 'Dedicated support'] },
  ],
};

const BrandContext = createContext<BrandContextType>({
  config: defaultBrand,
  updateConfig: () => {},
});

const useBrand = () => useContext(BrandContext);

// ==================== TYPES ====================
interface AppUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  countryCode?: string;
  avatarUrl?: string;
  role: 'client' | 'provider' | 'admin';
  location?: { lat: number; lng: number; city: string };
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  totalBookings: number;
  totalSpent: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl: string;
}

interface Provider {
  id: string;
  name: string;
  bio: string;
  specialties: string[];
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  avatarUrl: string;
  location?: { lat: number; lng: number; address: string };
}

interface Appointment {
  id: string;
  serviceName: string;
  providerName: string;
  customerName?: string;
  customerEmail?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  attachments?: { type: 'image' | 'pdf'; url: string; name: string }[];
  isOwn: boolean;
}

interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: 'pharmacy' | 'apparel';
  subcategory: string;
  stock: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sizes?: string[];
}

interface CartItem extends ShopProduct {
  quantity: number;
  selectedSize?: string;
}

interface MapLocation {
  id: string;
  name: string;
  type: 'clinic' | 'pharmacy' | 'doctor' | 'store';
  lat: number;
  lng: number;
  address: string;
  distance: number;
  eta: string;
  rating?: number;
  isOpen?: boolean;
}

interface NotificationLog {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  recipient: string;
  message: string;
  status: 'sent' | 'pending' | 'failed';
  timestamp: Date;
}

// ==================== MOCK DATA ====================
const mockServices: Service[] = [
  { id: '1', name: 'Haircut & Styling', description: 'Professional haircut with styling consultation', durationMinutes: 45, price: 55, imageUrl: 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '2', name: 'Full Color Treatment', description: 'Complete hair color transformation with premium products', durationMinutes: 120, price: 180, imageUrl: 'https://images.pexels.com/photos/3997371/pexels-photo-3997371.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '3', name: 'Deep Conditioning Spa', description: 'Intensive hair treatment for damaged or dry hair', durationMinutes: 60, price: 85, imageUrl: 'https://images.pexels.com/photos/1748795/pexels-photo-1748795.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '4', name: 'Beard Trim & Shape', description: 'Expert beard grooming with hot towel treatment', durationMinutes: 30, price: 35, imageUrl: 'https://images.pexels.com/photos/1681011/pexels-photo-1681011.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '5', name: 'Bridal Package', description: 'Complete bridal hair styling including trial', durationMinutes: 180, price: 320, imageUrl: 'https://images.pexels.com/photos/1692017/pexels-photo-1692017.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const mockProviders: Provider[] = [
  { id: '1', name: 'David Chen', bio: 'Master stylist with 15+ years experience.', specialties: ['Modern Cuts', 'Color Expert'], isAvailable: true, rating: 4.9, totalReviews: 234, avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', location: { lat: 36.7538, lng: 3.0588, address: '15 Rue Didouche Mourad, Algiers' } },
  { id: '2', name: 'Eleanor Ross', bio: 'Creative director specializing in bridal styling.', specialties: ['Bridal', 'Editorial'], isAvailable: true, rating: 5.0, totalReviews: 189, avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', location: { lat: 36.7638, lng: 3.0688, address: '42 Boulevard Mohamed V, Algiers' } },
];

const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+213-555-0101', createdAt: '2026-01-15', totalBookings: 8, totalSpent: 420 },
  { id: 'c2', name: 'Michael Brown', email: 'michael@email.com', phone: '+213-555-0102', createdAt: '2026-02-20', totalBookings: 3, totalSpent: 165 },
  { id: 'c3', name: 'Emma Wilson', email: 'emma@email.com', phone: '+213-555-0103', createdAt: '2026-03-10', totalBookings: 12, totalSpent: 890 },
];

const mockMessages: Message[] = [
  { id: '1', senderId: 'provider-1', senderName: 'David Chen', content: 'Hi! Looking forward to your appointment next week.', timestamp: new Date('2026-07-05T09:30:00'), isOwn: false },
  { id: '2', senderId: 'user', senderName: 'You', content: 'Hi David! Yes, I was thinking of going for a modern fade.', timestamp: new Date('2026-07-05T10:15:00'), isOwn: true },
  { id: '3', senderId: 'provider-1', senderName: 'David Chen', content: 'That sounds great! See you on the 8th!', timestamp: new Date('2026-07-05T10:30:00'), isOwn: false },
];

const pharmacyProducts: ShopProduct[] = [
  { id: 'p1', name: 'Vitamin D3 5000 IU', description: 'High-strength vitamin D supplement', price: 12.99, originalPrice: 15.99, imageUrl: 'https://images.pexels.com/photos/5935140/pexels-photo-5935140.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'pharmacy', subcategory: 'Vitamins', stock: 150, rating: 4.8, reviewCount: 234, inStock: true },
  { id: 'p2', name: 'First Aid Kit Premium', description: 'Complete emergency kit with 120 pieces', price: 34.99, imageUrl: 'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'pharmacy', subcategory: 'Medical Supplies', stock: 45, rating: 4.9, reviewCount: 156, inStock: true },
];

const apparelProducts: ShopProduct[] = [
  { id: 'a1', name: 'Premium Medical Scrub Set', description: 'Comfortable, breathable scrubs', price: 49.99, originalPrice: 69.99, imageUrl: 'https://images.pexels.com/photos/5207017/pexels-photo-5207017.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'apparel', subcategory: 'Scrubs', stock: 45, rating: 4.9, reviewCount: 234, inStock: true, sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] },
  { id: 'a2', name: 'Nurse Comfort Clogs', description: 'Anti-slip professional footwear', price: 59.99, imageUrl: 'https://images.pexels.com/photos/5207017/pexels-photo-5207017.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'apparel', subcategory: 'Footwear', stock: 32, rating: 4.7, reviewCount: 156, inStock: true, sizes: ['36', '37', '38', '39', '40', '41', '42'] },
];

const mapLocations: MapLocation[] = [
  { id: 'm1', name: 'Central Clinic Algiers', type: 'clinic', lat: 36.7538, lng: 3.0588, address: '15 Rue Didouche Mourad, Algiers', distance: 1.2, eta: '5 min', rating: 4.8, isOpen: true },
  { id: 'm2', name: 'Pharmacy El Moustakbal', type: 'pharmacy', lat: 36.7588, lng: 3.0538, address: '8 Rue Larbi Ben M\'Hidi, Algiers', distance: 0.8, eta: '3 min', rating: 4.6, isOpen: true },
];

const countryCodes = [
  { code: '+213', country: 'DZ', flag: '🇩🇿' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
];

// ==================== AUDIO CONTEXT FOR SONIC BRANDING ====================
const createSonicBrand = () => {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      const startTime = audioContext.currentTime + i * 0.12;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });
  } catch {
    console.log('Audio not supported');
  }
};

// ==================== MAIN APP ====================
function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(defaultBrand);
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'auth' | 'dashboard' | 'booking' | 'billing' | 'chat' | 'profile' | 'shop' | 'maps' | 'admin' | 'customers' | 'notifications' | 'communications'>('splash');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<AppUser | null>(null);
  const [splashComplete, setSplashComplete] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioPlayedRef = useRef(false);

  // Dynamic data state
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', serviceName: 'Haircut & Styling', providerName: 'David Chen', customerName: 'Sarah Johnson', date: '2026-07-08', time: '10:00 AM', status: 'confirmed', amount: 55 },
    { id: '2', serviceName: 'Full Color Treatment', providerName: 'Eleanor Ross', customerName: 'Michael Brown', date: '2026-07-12', time: '2:30 PM', status: 'pending', amount: 180 },
    { id: '3', serviceName: 'Deep Conditioning Spa', providerName: 'David Chen', customerName: 'Emma Wilson', date: '2026-06-15', time: '11:00 AM', status: 'completed', amount: 85 },
  ]);

  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Theme effect
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
  }, [theme]);

  // Splash screen effect
  useEffect(() => {
    if (currentScreen === 'splash' && !splashComplete) {
      if (audioEnabled && !audioPlayedRef.current) {
        audioPlayedRef.current = true;
        setTimeout(createSonicBrand, 300);
      }
      const timer = setTimeout(() => {
        setSplashComplete(true);
        setCurrentScreen('auth');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, splashComplete, audioEnabled]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleLogin = (email: string, _password: string, isAdmin: boolean = false) => {
    const mockUser: AppUser = {
      id: 'user-1',
      email: email,
      fullName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      role: isAdmin ? 'admin' : 'client',
      location: { lat: 36.7538, lng: 3.0588, city: 'Algiers, Algeria' },
    };
    setUser(mockUser);
    setCurrentScreen('dashboard');
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    const mockUser: AppUser = {
      id: 'user-1',
      email: 'user@example.com',
      fullName: provider === 'google' ? 'Google User' : 'Apple User',
      role: 'client',
      location: { lat: 36.7538, lng: 3.0588, city: 'Algiers, Algeria' },
    };
    setUser(mockUser);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setSplashComplete(false);
    audioPlayedRef.current = false;
    setCurrentScreen('splash');
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const updateBrandConfig = (updates: Partial<BrandConfig>) => {
    setBrandConfig({ ...brandConfig, ...updates });
    showToast('Settings saved successfully!', 'success');
  };

  // CRUD Operations
  const addAppointment = (apt: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = { ...apt, id: Date.now().toString() };
    setAppointments([newAppointment, ...appointments]);
    showToast('Appointment created successfully!', 'success');
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    showToast(`Appointment ${status}!`, 'success');
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
    showToast('Appointment deleted', 'success');
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'totalBookings' | 'totalSpent'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      totalBookings: 0,
      totalSpent: 0,
    };
    setCustomers([newCustomer, ...customers]);
    showToast('Customer added successfully!', 'success');
  };

  const sendNotification = (type: 'email' | 'sms' | 'whatsapp', recipient: string, message: string) => {
    const notification: NotificationLog = {
      id: Date.now().toString(),
      type,
      recipient,
      message,
      status: 'sent',
      timestamp: new Date(),
    };
    setNotificationLogs([notification, ...notificationLogs]);
    showToast(`${type.toUpperCase()} sent to ${recipient}!`, 'success');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <BrandContext.Provider value={{ config: brandConfig, updateConfig: updateBrandConfig }}>
        <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-cyber-900 text-white' : 'bg-light-100 text-light-900'} overflow-x-hidden`}>
          {currentScreen === 'splash' && (
            <SplashScreen audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} />
          )}

          {currentScreen === 'auth' && (
            <AuthScreen
              mode={authMode}
              setMode={setAuthMode}
              onLogin={handleLogin}
              onSocialLogin={handleSocialLogin}
            />
          )}

          {currentScreen === 'dashboard' && user && (
            <Dashboard
              user={user}
              onNavigate={setCurrentScreen}
              onLogout={handleLogout}
              appointments={appointments}
              onAddAppointment={addAppointment}
              onUpdateStatus={updateAppointmentStatus}
              onDeleteAppointment={deleteAppointment}
            />
          )}

          {currentScreen === 'customers' && user && (
            <CustomersScreen
              onBack={() => setCurrentScreen('dashboard')}
              customers={customers}
              onAddCustomer={addCustomer}
            />
          )}

          {currentScreen === 'notifications' && user && (
            <NotificationsScreen
              onBack={() => setCurrentScreen('dashboard')}
              appointments={appointments}
              notificationLogs={notificationLogs}
              onSendNotification={sendNotification}
            />
          )}

          {currentScreen === 'admin' && user && user.role === 'admin' && (
            <AdminPanel
              onBack={() => setCurrentScreen('dashboard')}
            />
          )}

          {currentScreen === 'booking' && user && (
            <BookingWizard
              user={user}
              onBack={() => setCurrentScreen('dashboard')}
              onComplete={() => setCurrentScreen('dashboard')}
              onBook={addAppointment}
            />
          )}

          {currentScreen === 'billing' && user && (
            <BillingPage onBack={() => setCurrentScreen('dashboard')} />
          )}

          {currentScreen === 'chat' && user && (
            <ChatScreen user={user} onBack={() => setCurrentScreen('dashboard')} />
          )}

          {currentScreen === 'profile' && user && (
            <ProfileScreen user={user} onBack={() => setCurrentScreen('dashboard')} onLogout={handleLogout} />
          )}

          {currentScreen === 'shop' && user && (
            <ShopScreen onBack={() => setCurrentScreen('dashboard')} />
          )}

          {currentScreen === 'maps' && user && (
            <MapsScreen user={user} onBack={() => setCurrentScreen('dashboard')} onSelectLocation={() => {}} />
          )}

          {currentScreen === 'communications' && user && (
            <CommunicationsDashboard user={user} onBack={() => setCurrentScreen('dashboard')} />
          )}

          {/* Toast notification */}
          {toast && (
            <div className={`toast ${toast.type === 'success' ? 'bg-neon-green text-cyber-900' : 'bg-red-500 text-white'}`}>
              {toast.type === 'success' ? <CheckCircle className="w-4 h-4 inline mr-2" /> : <AlertCircle className="w-4 h-4 inline mr-2" />}
              {toast.message}
            </div>
          )}
        </div>
      </BrandContext.Provider>
    </ThemeContext.Provider>
  );
}

// ==================== SPLASH SCREEN ====================
const SplashScreen: React.FC<{
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}> = ({ audioEnabled, setAudioEnabled }) => {
  const { config } = useBrand();

  return (
    <div className="fixed inset-0 bg-cyber-900 flex items-center justify-center z-50 cyber-grid-bg">
      <button
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="absolute top-6 right-6 p-3 rounded-full bg-cyber-800/50 border border-cyber-600/30 hover:border-neon-blue/50 transition-all duration-300 z-10"
      >
        {audioEnabled ? <Volume2 className="w-5 h-5 text-neon-blue" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
      </button>

      <div className="text-center animate-fade-in">
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-3xl opacity-30">
            <div className="w-48 h-48 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan animate-pulse" />
          </div>

          <div className="relative z-10">
            <h1 className="font-display text-6xl md:text-7xl font-bold tracking-wider animate-pulse-glow">
              <span className="bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-blue bg-clip-text text-transparent">
                {config.companyName.toUpperCase()}
              </span>
            </h1>
            <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-shimmer"
                 style={{ backgroundSize: '200% 100%', minWidth: '300px' }} />
          </div>
        </div>

        <p className="mt-6 text-gray-400 text-lg tracking-widest animate-slide-up" style={{ animationDelay: '0.3s' }}>
          APPOINTMENT BOOKING & CRM
        </p>

        <div className="mt-12 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== AUTH SCREEN ====================
const AuthScreen: React.FC<{
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
  onLogin: (email: string, password: string, isAdmin?: boolean) => void;
  onSocialLogin: (provider: 'google' | 'apple') => void;
}> = ({ mode, setMode, onLogin, onSocialLogin }) => {
  const { theme, toggleTheme } = useTheme();
  const { config } = useBrand();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-neon-green'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup') {
      if (password !== confirmPassword) { setError('Passwords do not match'); return; }
      if (passwordStrength < 2) { setError('Please choose a stronger password'); return; }
      if (!acceptedTerms) { setError('Please accept the Terms & Privacy Policy'); return; }
    }
    const isAdmin = email.includes('admin');
    onLogin(email, password, isAdmin);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 cyber-grid-bg safe-area-bottom ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <button onClick={toggleTheme} className="absolute top-6 left-6 p-3 rounded-full glass-card hover:shadow-neon-blue transition-all">
        {theme === 'dark' ? <Sun className="w-5 h-5 text-neon-blue" /> : <Moon className="w-5 h-5 text-cyber-800" />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
            {config.companyName.toUpperCase()}
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <div className="glass-card p-8">
          <div className="space-y-3 mb-6">
            <button onClick={() => onSocialLogin('google')} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.27H2.18C1.43 8.82 1 10.36 1 12s.43 3.18 1.18 4.73l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.19 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.27l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button onClick={() => onSocialLogin('apple')} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white font-medium rounded-xl border border-gray-700 hover:bg-gray-900 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-3.26 0-4.17-1.77-6.26-1.77-1.83 0-4.22 1.87-4.22 1.87C6.17 22.08 4.58 23 2.5 23c-1.41 0-2.75-.75-2.75-3V4.5c0-2.25 1.34-3 2.75-3s2.54.75 3.88 2.25l1.62-1.62c.87-.87 2.13-1.13 3.26-.87 1.13.25 2.13.87 2.75 1.87l.75 1.25c1.5-2.5 4.5-3.75 7.24-2.5 2.75 1.25 3.5 4.25 2.5 7l-.12.25c-.25.62-.62 1.25-1.12 1.87l-.38.5c-.75 1-1.62 2.25-1.62 4.25s.87 3.37 1.71 4.25l.38.37c.5.5.87 1.12 1.12 1.75l.12.25c.5 1.12.38 2.25-.38 3.25z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${theme === 'dark' ? 'border-cyber-600/50' : 'border-light-300'}`} /></div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${theme === 'dark' ? 'bg-cyber-800/80 text-gray-500' : 'bg-white text-light-500'}`}>or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="input-neon pl-12" required />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-neon pl-12" required />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>Phone Number</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <button type="button" onClick={() => setShowCountryPicker(!showCountryPicker)} className="flex items-center gap-2 px-3 py-3 input-neon">
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm">{selectedCountry.code}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showCountryPicker && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-cyber-800 border border-cyber-600/50 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="max-h-48 overflow-y-auto">
                          {countryCodes.map((c) => (
                            <button key={c.code} type="button" onClick={() => { setSelectedCountry(c); setShowCountryPicker(false); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-cyber-700 transition-colors">
                              <span className="text-lg">{c.flag}</span>
                              <span className="text-sm text-gray-300">{c.country}</span>
                              <span className="text-sm text-gray-500 ml-auto">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="555-123-4567" className="input-neon pl-12" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="input-neon pl-12 pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {mode === 'signup' && password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => <div key={i} className={`h-1 flex-1 rounded-full ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-cyber-600'}`} />)}
                  </div>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="input-neon pl-12" required />
                </div>
                {confirmPassword && password !== confirmPassword && <p className="mt-1 text-xs text-red-400">Passwords do not match</p>}
                {confirmPassword && password === confirmPassword && <p className="mt-1 text-xs text-neon-green">Passwords match</p>}
              </div>
            )}

            {mode === 'signup' && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="sr-only" />
                <div className={`w-5 h-5 rounded border ${acceptedTerms ? 'bg-neon-blue border-neon-blue' : 'border-cyber-500'}`}>
                  {acceptedTerms && <Check className="w-full h-full text-cyber-900 p-0.5" />}
                </div>
                <span className="text-sm text-gray-400">I agree to the <span className="text-neon-blue">Terms of Service</span> and <span className="text-neon-blue">Privacy Policy</span></span>
              </label>
            )}

            {error && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}

            <button type="submit" className="btn-neon w-full flex items-center justify-center gap-2" disabled={mode === 'signup' && (!acceptedTerms || password !== confirmPassword)}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-neon-blue hover:underline font-medium">
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== DASHBOARD ====================
type Screen = 'splash' | 'auth' | 'dashboard' | 'booking' | 'billing' | 'chat' | 'profile' | 'shop' | 'maps' | 'admin' | 'customers' | 'notifications' | 'communications';

const Dashboard: React.FC<{
  user: AppUser;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  appointments: Appointment[];
  onAddAppointment: (apt: Omit<Appointment, 'id'>) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onDeleteAppointment: (id: string) => void;
}> = ({ user, onNavigate, onLogout, appointments, onAddAppointment, onUpdateStatus, onDeleteAppointment }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'explore'>('home');

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className={`min-h-screen pb-24 md:pb-8 ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              MERIDIAN
            </h1>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-cyber-700/50 transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-neon-blue" /> : <Moon className="w-5 h-5 text-light-700" />}
              </button>
              <button className="relative p-2 rounded-full hover:bg-cyber-700/50 transition-colors">
                <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-neon-blue rounded-full" />
              </button>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2 rounded-full hover:bg-cyber-700/50">
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="hidden md:flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('profile')}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center">
                  <span className="text-cyber-900 font-semibold">{user.fullName.charAt(0)}</span>
                </div>
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-light-700'}>{user.fullName}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className={`absolute right-0 top-16 w-64 min-h-[calc(100vh-4rem)] p-4 ${theme === 'dark' ? 'bg-cyber-800 border-l border-cyber-600/30' : 'bg-white border-l border-light-200'}`} onClick={e => e.stopPropagation()}>
            <div className="space-y-2">
              <button onClick={() => { onNavigate('dashboard'); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-cyber-700/50 text-white">
                <Home className="w-5 h-5" /> Dashboard
              </button>
              <button onClick={() => { setShowAddModal(true); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyber-700/50 text-gray-300">
                <Calendar className="w-5 h-5" /> New Appointment
              </button>
              <button onClick={() => { onNavigate('customers'); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyber-700/50 text-gray-300">
                <Users className="w-5 h-5" /> Customers
              </button>
              <button onClick={() => { onNavigate('notifications'); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyber-700/50 text-gray-300">
                <MessageSquare className="w-5 h-5" /> Notifications
              </button>
              <button onClick={() => { onNavigate('communications'); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyber-700/50 text-gray-300">
                <Video className="w-5 h-5" /> Video Consultation
              </button>
              <button onClick={() => { onNavigate('shop'); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyber-700/50 text-gray-300">
                <Store className="w-5 h-5" /> Shop
              </button>
              <button onClick={() => { onNavigate('billing'); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyber-700/50 text-gray-300">
                <CreditCard className="w-5 h-5" /> Billing
              </button>
              {user.role === 'admin' && (
                <button onClick={() => { onNavigate('admin'); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyber-700/50 text-neon-blue">
                  <Settings className="w-5 h-5" /> Admin Settings
                </button>
              )}
              <hr className="border-cyber-600/30 my-2" />
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveSection('home')} className={`px-4 py-2 rounded-xl font-medium transition-all ${activeSection === 'home' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-gray-400'}`}>
            <Home className="w-4 h-4 inline mr-2" />Home
          </button>
          <button onClick={() => setActiveSection('explore')} className={`px-4 py-2 rounded-xl font-medium transition-all ${activeSection === 'explore' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-gray-400'}`}>
            <Compass className="w-4 h-4 inline mr-2" />Explore
          </button>
        </div>

        {activeSection === 'home' && (
          <>
            <div className="mb-8">
              <h2 className={`text-2xl md:text-3xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                Welcome back, <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">{user.fullName}</span>!
              </h2>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Here's what's happening with your appointments</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Wallet, label: 'Total Revenue', value: '$2,450', color: 'neon-green' },
                { icon: Calendar, label: 'Active Bookings', value: upcomingAppointments.length.toString(), color: 'neon-blue' },
                { icon: Users, label: 'Customers', value: mockCustomers.length.toString(), color: 'neon-cyan' },
                { icon: Star, label: 'Rating', value: '4.9', color: 'purple-400' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                    </div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>{stat.label}</span>
                  </div>
                  <p className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
              <button onClick={() => setShowAddModal(true)} className="glass-card-hover p-4 flex flex-col items-center gap-2">
                <div className="p-3 rounded-xl bg-neon-blue/10"><Plus className="w-6 h-6 text-neon-blue" /></div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>New Booking</span>
              </button>
              <button onClick={() => onNavigate('customers')} className="glass-card-hover p-4 flex flex-col items-center gap-2">
                <div className="p-3 rounded-xl bg-neon-cyan/10"><Users className="w-6 h-6 text-neon-cyan" /></div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Customers</span>
              </button>
              <button onClick={() => onNavigate('communications')} className="glass-card-hover p-4 flex flex-col items-center gap-2">
                <div className="p-3 rounded-xl bg-neon-green/10"><Video className="w-6 h-6 text-neon-green" /></div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Consultation</span>
              </button>
              <button onClick={() => onNavigate('notifications')} className="glass-card-hover p-4 flex flex-col items-center gap-2">
                <div className="p-3 rounded-xl bg-neon-green/10"><MessageSquare className="w-6 h-6 text-neon-green" /></div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Notifications</span>
              </button>
              <button onClick={() => onNavigate('shop')} className="glass-card-hover p-4 flex flex-col items-center gap-2">
                <div className="p-3 rounded-xl bg-purple-500/10"><Store className="w-6 h-6 text-purple-400" /></div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Shop</span>
              </button>
              {user.role === 'admin' && (
                <button onClick={() => onNavigate('admin')} className="glass-card-hover p-4 flex flex-col items-center gap-2">
                  <div className="p-3 rounded-xl bg-amber-500/10"><Settings className="w-6 h-6 text-amber-400" /></div>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Admin</span>
                </button>
              )}
            </div>

            <div className="glass-card mb-8">
              <div className={`p-4 md:p-6 border-b ${theme === 'dark' ? 'border-cyber-600/30' : 'border-light-200'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Appointments</h3>
                  <div className="flex gap-2">
                    {['upcoming', 'past'].map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab as 'upcoming' | 'past')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-gray-400'}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-6 space-y-4 max-h-96 overflow-y-auto safe-area-bottom">
                {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map((apt) => (
                  <div key={apt.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${theme === 'dark' ? 'bg-cyber-800/50 border-cyber-600/20 hover:border-neon-blue/30' : 'bg-white border-light-200 hover:border-neon-blue/30'}`}>
                    <div className="hidden sm:block w-16 h-16 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 flex items-center justify-center">
                      <Scissors className="w-8 h-8 text-neon-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{apt.serviceName}</h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>with {apt.providerName} {apt.customerName && `· ${apt.customerName}`}</p>
                      <div className={`flex items-center gap-4 mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{apt.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${apt.status === 'confirmed' ? 'badge-success' : apt.status === 'pending' ? 'badge-warning' : apt.status === 'completed' ? 'badge-info' : 'badge-error'}`}>{apt.status}</span>
                      <p className={`mt-2 font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>${apt.amount}</p>
                      <div className="flex gap-1 mt-2">
                                  {/* WhatsApp Reminder Button */}
          <button
            onClick={() => {
              const message = `Hello ${apt.customer_name || apt.name || 'Client'} 👋\n\nThis is a friendly reminder for your upcoming appointment:\n📅 Date: ${apt.date}\n⏰ Time: ${apt.time}\n\nPlease let us know if you need to reschedule. Have a great day! ✨`;
              const cleanPhone = (apt.phone || apt.phone_number || '').replace(/\D/g, '');
              window.open(`https://wa.me{cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
            }}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2.5 rounded-md shadow-sm transition-all duration-200 text-[10px]"
          >
            <span>WhatsApp</span>
          </button>

                        {apt.status === 'pending' && <button onClick={() => onUpdateStatus(apt.id, 'confirmed')} className="p-1 rounded text-neon-green hover:bg-neon-green/10"><Check className="w-4 h-4" /></button>}
                        {apt.status !== 'completed' && <button onClick={() => onDeleteAppointment(apt.id)} className="p-1 rounded text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    </div>
                  </div>
                ))}
                {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).length === 0 && (
                  <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-light-500'}`}>
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No {activeTab} appointments</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeSection === 'explore' && (
          <div className="animate-fade-in">
            <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Explore Nearby</h2>
            <div className="glass-card p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-neon-blue" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-light-700'}>Your location: {user.location?.city || 'Algiers, Algeria'}</span>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden bg-cyber-700">
                <div className="absolute inset-0 cyber-grid-bg opacity-50" />
                {mapLocations.slice(0, 4).map((loc, i) => {
                  const positions = [{ top: '20%', left: '30%' }, { top: '40%', left: '60%' }, { top: '60%', left: '25%' }, { top: '30%', left: '70%' }];
                  return (
                    <div key={loc.id} className="absolute w-8 h-8 rounded-full bg-cyber-800 border-2 border-neon-cyan flex items-center justify-center cursor-pointer" style={positions[i]}>
                      {loc.type === 'clinic' ? <Medical className="w-4 h-4 text-neon-cyan" /> : loc.type === 'pharmacy' ? <Pill className="w-4 h-4 text-neon-green" /> : <MapPin className="w-4 h-4 text-neon-blue" />}
                    </div>
                  );
                })}
              </div>
              <button onClick={() => onNavigate('maps')} className="btn-neon w-full mt-4 flex items-center justify-center gap-2">
                <Navigation className="w-5 h-5" />Open GPS Navigation
              </button>
            </div>
          </div>
        )}
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t md:hidden z-40 safe-area-bottom ${theme === 'dark' ? 'bg-cyber-800/90 border-cyber-600/30' : 'bg-white/90 border-light-200'}`}>
        <div className="flex items-center justify-around py-2">
          <button onClick={() => { setActiveSection('home'); onNavigate('dashboard'); }} className="flex flex-col items-center gap-1 p-2 text-neon-blue">
            <Home className="w-5 h-5" /><span className="text-xs">Home</span>
          </button>
          <button onClick={() => onNavigate('customers')} className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Users className="w-5 h-5" /><span className="text-xs">Customers</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex flex-col items-center gap-1 p-2 text-neon-green">
            <Plus className="w-6 h-6" /><span className="text-xs">Add</span>
          </button>
          <button onClick={() => onNavigate('communications')} className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Video className="w-5 h-5" /><span className="text-xs">Video</span>
          </button>
          <button onClick={() => onNavigate('shop')} className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Store className="w-5 h-5" /><span className="text-xs">Shop</span>
          </button>
        </div>
      </nav>

      {/* Floating Video Call Quick Access Button */}
      <button
        onClick={() => onNavigate('communications')}
        className="fixed right-6 bottom-24 md:bottom-8 w-14 h-14 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan flex items-center justify-center shadow-neon-blue hover:scale-110 transition-transform z-30 animate-pulse-glow"
        title="Video Consultation"
      >
        <Video className="w-6 h-6 text-cyber-900" />
      </button>

      {showAddModal && (
        <AddAppointmentModal
          onClose={() => setShowAddModal(false)}
          onAdd={onAddAppointment}
        />
      )}
    </div>
  );
};

// ==================== ADD APPOINTMENT MODAL ====================
const AddAppointmentModal: React.FC<{
  onClose: () => void;
  onAdd: (apt: Omit<Appointment, 'id'>) => void;
}> = ({ onClose, onAdd }) => {
  const [serviceName, setServiceName] = useState(mockServices[0].name);
  const [providerName, setProviderName] = useState(mockProviders[0].name);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = mockServices.find(s => s.name === serviceName);
    onAdd({
      serviceName,
      providerName,
      customerName: customerName || undefined,
      customerEmail: customerEmail || undefined,
      date,
      time,
      status: 'pending',
      amount: service?.price || 0,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">New Appointment</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-cyber-700/50"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Service</label>
            <select value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="input-neon">
              {mockServices.map((s) => <option key={s.id} value={s.name}>{s.name} - ${s.price}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Provider</label>
            <select value={providerName} onChange={(e) => setProviderName(e.target.value)} className="input-neon">
              {mockProviders.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Customer Name</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Optional" className="input-neon" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Customer Email</label>
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Optional" className="input-neon" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-neon" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-neon" required />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-neon flex-1">Create Appointment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== CUSTOMERS SCREEN ====================
const CustomersScreen: React.FC<{
  onBack: () => void;
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalBookings' | 'totalSpent'>) => void;
}> = ({ onBack, customers, onAddCustomer }) => {
  const { theme } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className={`min-h-screen pb-8 ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
                {/* Global Announcement Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center py-2 px-4 text-xs md:text-sm font-medium flex items-center justify-center gap-2 relative z-50">
            <span>🚀 <strong>New Update:</strong> Automated WhatsApp reminders are now active for your appointments!</span>
            <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">PRO</span>
          </div>

      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronLeft className="w-6 h-6" /></button>
          <h1 className={`font-display text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Customers</h1>
                    {/* Smart Top Search Bar */}
          <div className="relative flex-1 max-w-xs ml-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search customers or appointments..."
              className={`block w-full pl-9 pr-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                theme === 'dark' 
                  ? 'bg-cyber-800 border-cyber-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <button onClick={() => setShowAddModal(true)} className="ml-auto btn-neon flex items-center gap-2">
            <Plus className="w-4 h-4" />Add Customer
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${theme === 'dark' ? 'border-cyber-600/30' : 'border-light-200'}`}>
                <tr>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Bookings</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className={`border-b ${theme === 'dark' ? 'border-cyber-600/20 hover:bg-cyber-700/20' : 'border-light-200 hover:bg-light-200/50'}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center text-cyber-900 font-medium text-sm">
                          {customer.name.charAt(0)}
                        </div>
                        <span className={theme === 'dark' ? 'text-white' : 'text-light-900'}>{customer.name}</span>
                      </div>
                    </td>
                    <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>{customer.email}</td>
                    <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>{customer.phone}</td>
                    <td className={`py-3 px-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{customer.totalBookings}</td>
                    <td className="py-3 px-4 text-neon-blue font-semibold">${customer.totalSpent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showAddModal && (
        <AddCustomerModal onClose={() => setShowAddModal(false)} onAdd={onAddCustomer} />
      )}
    </div>
  );
};

// ==================== ADD CUSTOMER MODAL ====================
const AddCustomerModal: React.FC<{
  onClose: () => void;
  onAdd: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalBookings' | 'totalSpent'>) => void;
}> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, email, phone });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Add Customer</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-cyber-700/50"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-neon" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-neon" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-neon" required />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-neon flex-1">Add Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== NOTIFICATIONS SCREEN ====================
const NotificationsScreen: React.FC<{
  onBack: () => void;
  appointments: Appointment[];
  notificationLogs: NotificationLog[];
  onSendNotification: (type: 'email' | 'sms' | 'whatsapp', recipient: string, message: string) => void;
}> = ({ onBack, appointments, notificationLogs, onSendNotification }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'send' | 'logs'>('send');
  const [notificationType, setNotificationType] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [autoReminders, setAutoReminders] = useState({ email: true, sms: false, whatsapp: false });

  const handleSend = () => {
    if (recipient && message) {
      onSendNotification(notificationType, recipient, message);
      setRecipient('');
      setMessage('');
    }
  };

  const handleQuickSend = (apt: Appointment, type: 'email' | 'sms' | 'whatsapp') => {
    const msg = `Reminder: Your ${apt.serviceName} appointment with ${apt.providerName} is scheduled for ${apt.date} at ${apt.time}.`;
    onSendNotification(type, apt.customerEmail || recipient, msg);
  };

  return (
    <div className={`min-h-screen pb-8 ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronLeft className="w-6 h-6" /></button>
          <h1 className={`font-display text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Notifications Center</h1>
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <button onClick={() => setActiveTab('send')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'send' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-gray-400'}`}>Send Notifications</button>
          <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'logs' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-gray-400'}`}>History</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'send' && (
          <div className="animate-fade-in space-y-6">
            {/* Auto reminders toggle */}
            <div className="glass-card p-6">
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Automated Reminders</h3>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Enable automatic appointment reminders for all bookings.</p>
              <div className="space-y-3">
                {(['email', 'sms', 'whatsapp'] as const).map((type) => (
                  <label key={type} className="flex items-center justify-between p-3 bg-cyber-700/30 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      {type === 'email' ? <MailIcon className="w-5 h-5 text-neon-blue" /> :
                       type === 'sms' ? <MessageSquare className="w-5 h-5 text-neon-green" /> :
                       <SendIcon className="w-5 h-5 text-neon-cyan" />}
                      <div>
                        <span className={theme === 'dark' ? 'text-white' : 'text-light-900'}>{type === 'email' ? 'Email Reminders' : type === 'sms' ? 'SMS Reminders' : 'WhatsApp Reminders'}</span>
                        <p className="text-xs text-gray-400">Send 24 hours before appointment</p>
                      </div>
                    </div>
                    <button onClick={() => setAutoReminders({ ...autoReminders, [type]: !autoReminders[type] })} className={`w-12 h-6 rounded-full transition-colors ${autoReminders[type] ? 'bg-neon-green' : 'bg-cyber-600'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${autoReminders[type] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* Manual send */}
            <div className="glass-card p-6">
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Send Manual Notification</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Channel</label>
                  <div className="flex gap-2">
                    {(['email', 'sms', 'whatsapp'] as const).map((type) => (
                      <button key={type} onClick={() => setNotificationType(type)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${notificationType === type ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'bg-cyber-700/50 text-gray-400'}`}>
                        {type === 'email' ? <MailIcon className="w-4 h-4" /> : type === 'sms' ? <MessageSquare className="w-4 h-4" /> : <SendIcon className="w-4 h-4" />}
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Recipient</label>
                  <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder={notificationType === 'email' ? 'email@example.com' : notificationType === 'sms' ? '+2135550101' : '+2135550101'} className="input-neon" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." className="input-neon h-24 resize-none" />
                </div>
                <button onClick={handleSend} className="btn-neon w-full flex items-center justify-center gap-2">
                  <SendIcon className="w-4 h-4" />Send {notificationType.toUpperCase()}
                </button>
              </div>
            </div>

            {/* Quick send from appointments */}
            <div className="glass-card p-6">
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Quick Send from Appointments</h3>
              <div className="space-y-3">
                {appointments.filter(a => a.customerEmail).slice(0, 3).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-cyber-700/30 rounded-lg">
                    <div>
                      <span className={theme === 'dark' ? 'text-white' : 'text-light-900'}>{apt.customerName}</span>
                      <p className="text-xs text-gray-400">{apt.serviceName} · {apt.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleQuickSend(apt, 'email')} className="p-2 rounded bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20"><MailIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleQuickSend(apt, 'sms')} className="p-2 rounded bg-neon-green/10 text-neon-green hover:bg-neon-green/20"><MessageSquare className="w-4 h-4" /></button>
                      <button onClick={() => handleQuickSend(apt, 'whatsapp')} className="p-2 rounded bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20"><SendIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="animate-fade-in">
            <div className="glass-card p-6">
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Notification History</h3>
              {notificationLogs.length === 0 ? (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-light-500'}`}>
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications sent yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notificationLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-3 bg-cyber-700/30 rounded-lg">
                      {log.type === 'email' ? <MailIcon className="w-5 h-5 text-neon-blue" /> : log.type === 'sms' ? <MessageSquare className="w-5 h-5 text-neon-green" /> : <SendIcon className="w-5 h-5 text-neon-cyan" />}
                      <div className="flex-1">
                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{log.recipient}</p>
                        <p className="text-xs text-gray-400">{log.message.substring(0, 50)}...</p>
                      </div>
                      <span className="badge badge-success">{log.status}</span>
                      <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ==================== ADMIN PANEL ====================
const AdminPanel: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const { theme } = useTheme();
  const { config, updateConfig } = useBrand();
  const [companyName, setCompanyName] = useState(config.companyName);
  const [logoUrl, setLogoUrl] = useState(config.logoUrl);
  const [pricingTiers, setPricingTiers] = useState(config.pricingTiers);

  const handleSave = () => {
    updateConfig({ companyName, logoUrl, pricingTiers });
  };

  const updateTier = (index: number, field: 'name' | 'price', value: string | number) => {
    const newTiers = [...pricingTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setPricingTiers(newTiers);
  };

  const updateTierFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const newTiers = [...pricingTiers];
    newTiers[tierIndex].features[featureIndex] = value;
    setPricingTiers(newTiers);
  };

  return (
    <div className={`min-h-screen pb-8 ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronLeft className="w-6 h-6" /></button>
          <h1 className={`font-display text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Admin Settings</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Brand settings */}
        <div className="glass-card p-6">
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
            <Building className="w-5 h-5 text-neon-blue" /> Brand Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-neon" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Logo URL</label>
              <div className="flex gap-2">
                <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." className="input-neon flex-1" />
                <button className="btn-ghost flex items-center gap-2"><Upload className="w-4 h-4" />Upload</button>
              </div>
              {logoUrl && <img src={logoUrl} alt="Logo preview" className="mt-2 h-16 object-contain" />}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Preview</label>
              <div className="p-4 bg-cyber-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {logoUrl ? <img src={logoUrl} alt="" className="h-10 object-contain" /> : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center"><span className="text-cyber-900 font-bold">{companyName.charAt(0)}</span></div>}
                  <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">{companyName.toUpperCase()}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing tiers */}
        <div className="glass-card p-6">
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
            <CreditCard className="w-5 h-5 text-neon-cyan" /> Pricing Tiers
          </h3>
          <div className="space-y-4">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="p-4 bg-cyber-700/30 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tier Name</label>
                    <input type="text" value={tier.name} onChange={(e) => updateTier(index, 'name', e.target.value)} className="input-neon" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Price ($/month)</label>
                    <input type="number" value={tier.price} onChange={(e) => updateTier(index, 'price', parseFloat(e.target.value) || 0)} className="input-neon" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Features</label>
                  {tier.features.map((feature, fIndex) => (
                    <input key={fIndex} type="text" value={feature} onChange={(e) => updateTierFeature(index, fIndex, e.target.value)} className="input-neon mb-2" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button onClick={handleSave} className="btn-neon w-full flex items-center justify-center gap-2 py-4 text-lg">
          <Save className="w-5 h-5" />Save All Settings
        </button>
      </main>
    </div>
  );
};

// ==================== BOOKING WIZARD ====================
const BookingWizard: React.FC<{
  user: AppUser;
  onBack: () => void;
  onComplete: () => void;
  onBook: (apt: Omit<Appointment, 'id'>) => void;
}> = ({ user, onBack, onComplete, onBook }) => {
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const timeSlots = [
    { time: '9:00 AM', available: true }, { time: '10:00 AM', available: true }, { time: '11:00 AM', available: false },
    { time: '12:00 PM', available: true }, { time: '1:00 PM', available: false }, { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: true }, { time: '4:00 PM', available: true }, { time: '5:00 PM', available: false },
  ];

  const handleConfirmBooking = () => {
    if (selectedService && selectedProvider && selectedDate && selectedTime) {
      onBook({
        serviceName: selectedService.name,
        providerName: selectedProvider.name,
        customerName: user.fullName,
        customerEmail: user.email,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        status: 'pending',
        amount: selectedService.price,
      });
      setShowConfirmation(true);
      setTimeout(onComplete, 2000);
    }
  };

  const steps = ['Services', 'Professional', 'Date & Time', 'Details'];

  return (
    <div className={`min-h-screen pb-8 ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronLeft className="w-6 h-6" /></button>
            <h1 className={`font-display text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Book Appointment</h1>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {steps.map((label, index) => (
              <div key={label} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > index + 1 ? 'bg-neon-green text-cyber-900' : step === index + 1 ? 'bg-neon-blue text-cyber-900' : theme === 'dark' ? 'bg-cyber-700 text-gray-400' : 'bg-light-300 text-light-600'}`}>
                  {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`hidden sm:block ml-2 text-sm ${step >= index + 1 ? (theme === 'dark' ? 'text-white' : 'text-light-900') : 'text-gray-500'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockServices.map((service) => (
                <button key={service.id} onClick={() => setSelectedService(service)} className={`glass-card-hover p-4 text-left transition-all ${selectedService?.id === service.id ? 'border-neon-blue shadow-neon-blue scale-[1.02]' : ''}`}>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden"><img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{service.name}</h3>
                      <p className="text-sm text-gray-400">{service.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-sm text-gray-400"><Clock className="w-4 h-4" />{service.durationMinutes} min</span>
                        <span className="text-neon-blue font-semibold">${service.price}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Choose a Professional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProviders.map((provider) => (
                <button key={provider.id} onClick={() => setSelectedProvider(provider)} className={`glass-card-hover p-6 text-left transition-all ${selectedProvider?.id === provider.id ? 'border-neon-blue shadow-neon-blue' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyber-600"><img src={provider.avatarUrl} alt={provider.name} className="w-full h-full object-cover" /></div>
                      {provider.isAvailable && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-green rounded-full border-2 border-cyber-800 animate-pulse" />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{provider.name}</h3>
                      <p className="text-sm text-gray-400">{provider.bio}</p>
                      <div className="flex items-center gap-2 mt-2"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className={theme === 'dark' ? 'text-white' : 'text-light-900'}>{provider.rating}</span><span className="text-gray-400 text-sm">({provider.totalReviews})</span></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Select Date & Time</h2>
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronLeft className="w-5 h-5" /></button>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d} className="text-center text-sm text-gray-400 py-2">{d}</div>)}
                {getDaysInMonth(currentMonth).map((day, i) => (
                  <div key={i}>{day && <button onClick={() => day >= new Date() && setSelectedDate(day)} disabled={day < new Date()} className={`w-full h-full aspect-square rounded-lg flex items-center justify-center text-sm ${selectedDate?.toDateString() === day.toDateString() ? 'bg-neon-blue text-cyber-900' : day < new Date() ? 'text-gray-600 cursor-not-allowed' : 'hover:bg-cyber-700/50 text-white'}`}>{day.getDate()}</button>}</div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Available Time Slots</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {timeSlots.map((slot) => (
                  <button key={slot.time} onClick={() => slot.available && setSelectedTime(slot.time)} disabled={!slot.available} className={`p-3 rounded-xl text-sm font-medium ${selectedTime === slot.time ? 'bg-neon-blue text-cyber-900' : !slot.available ? 'bg-cyber-700/30 text-gray-500 cursor-not-allowed relative overflow-hidden' : 'bg-cyber-700/50 text-white hover:bg-cyber-700'}`}>
                    {slot.time}
                    {!slot.available && <span className="absolute inset-0 flex items-center justify-center bg-cyber-900/70 text-xs text-gray-400">Booked</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Booking Summary</h2>
            <div className="glass-card p-6 mb-6">
              <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Your Details</h3>
              <div className="grid grid-cols-2 gap-4"><div><label className="text-sm text-gray-400">Name</label><p className={theme === 'dark' ? 'text-white' : 'text-light-900'}>{user.fullName}</p></div><div><label className="text-sm text-gray-400">Email</label><p className={theme === 'dark' ? 'text-white' : 'text-light-900'}>{user.email}</p></div></div>
            </div>
            <div className="glass-card p-6">
              <div className="space-y-3">
                {[
                  { label: 'Service', value: selectedService?.name },
                  { label: 'Professional', value: selectedProvider?.name },
                  { label: 'Date', value: selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) },
                  { label: 'Time', value: selectedTime },
                  { label: 'Duration', value: `${selectedService?.durationMinutes} minutes` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-cyber-600/30">
                    <span className="text-gray-400">{row.label}</span>
                    <span className={theme === 'dark' ? 'text-white font-medium' : 'text-light-900 font-medium'}>{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-3">
                  <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Total</span>
                  <span className="text-2xl font-bold text-neon-blue">${selectedService?.price}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-6 animate-scale-in"><CheckCircle className="w-12 h-12 text-neon-green" /></div>
              <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
              <p className="text-gray-400">You'll receive a confirmation email shortly.</p>
            </div>
          </div>
        )}
      </main>

      <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t p-4 safe-area-bottom ${theme === 'dark' ? 'bg-cyber-800/90 border-cyber-600/30' : 'bg-white/90 border-light-200'}`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="btn-ghost flex items-center gap-2"><ChevronLeft className="w-5 h-5" />Back</button>}
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} disabled={(step === 1 && !selectedService) || (step === 2 && !selectedProvider) || (step === 3 && (!selectedDate || !selectedTime))} className="btn-neon flex items-center gap-2 ml-auto disabled:opacity-50">Continue<ChevronRight className="w-5 h-5" /></button>
          ) : (
            <button onClick={handleConfirmBooking} className="btn-neon flex items-center gap-2 ml-auto animate-glow">Confirm Booking · ${selectedService?.price}<Check className="w-5 h-5" /></button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== BILLING PAGE ====================
const BillingPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();
  const { config } = useBrand();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => { setShowCheckout(false); setPaymentSuccess(false); }, 2000);
  };

  return (
    <div className={`min-h-screen pb-24 ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronLeft className="w-6 h-6" /></button>
          <h1 className={`font-display text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Billing & Plans</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center mb-8">
          <div className="glass-card p-1 flex items-center gap-2">
            <button onClick={() => setBillingPeriod('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium ${billingPeriod === 'monthly' ? 'bg-neon-blue text-cyber-900' : 'text-gray-400'}`}>Monthly</button>
            <button onClick={() => setBillingPeriod('yearly')} className={`px-4 py-2 rounded-lg text-sm font-medium ${billingPeriod === 'yearly' ? 'bg-neon-blue text-cyber-900' : 'text-gray-400'}`}>Yearly<span className="ml-2 text-xs text-neon-green">Save 20%</span></button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.pricingTiers.map((plan, i) => (
            <div key={i} className={`glass-card relative p-6 flex flex-col ${i === 1 ? 'border-neon-blue/50 shadow-neon-blue' : ''}`}>
              {i === 1 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-blue text-cyber-900 text-xs font-bold rounded-full">Most Popular</div>}
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{plan.name}</h3>
              <div className="mb-6"><span className="text-4xl font-bold text-white">${plan.price}</span><span className="text-gray-400">/{billingPeriod === 'monthly' ? 'mo' : 'mo'}</span></div>
              <ul className="space-y-2 flex-1 mb-6">{plan.features.map((f, j) => <li key={j} className="flex items-start gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-neon-green" />{f}</li>)}</ul>
              <button onClick={() => setShowCheckout(true)} disabled={plan.price === 0} className={plan.price === 0 ? 'bg-cyber-700 text-gray-400 py-3 rounded-xl font-semibold cursor-default' : 'btn-neon'}>{plan.price === 0 ? 'Current Plan' : 'Upgrade'}</button>
            </div>
          ))}
        </div>
      </main>
      {showCheckout && (
        <div className="modal-overlay">
          <div className="glass-card w-full max-w-md p-6 animate-scale-in">
            {paymentSuccess ? (
              <div className="text-center py-8"><div className="w-20 h-20 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-neon-green" /></div><h3 className="text-xl font-bold text-white">Payment Successful!</h3></div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-6">Complete Payment</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm text-gray-400 mb-2">Card Number</label><input type="text" placeholder="4242 4242 4242 4242" className="input-neon pl-12" defaultValue="4242 4242 4242 4242" /></div>
                  <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="MM/YY" className="input-neon" defaultValue="12/26" /><input type="text" placeholder="CVC" className="input-neon" defaultValue="123" /></div>
                  <div className="flex gap-3"><button onClick={() => setShowCheckout(false)} className="btn-ghost flex-1">Cancel</button><button onClick={handlePayment} className="btn-neon flex-1">Pay</button></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== CHAT SCREEN ====================
const ChatScreen: React.FC<{ user: AppUser; onBack: () => void }> = ({ user, onBack }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showCall, setShowCall] = useState(false);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), senderId: user.id, senderName: user.fullName, content: newMessage, timestamp: new Date(), isOwn: true }]);
    setNewMessage('');
  };

  const startCall = (type: 'video' | 'audio') => {
    setCallType(type);
    setShowCall(true);
    setIsCallConnected(false);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoEnabled(type === 'video');
    setTimeout(() => {
      setIsCallConnected(true);
      callTimerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }, 2000);
  };

  const endCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setShowCall(false);
    setIsCallConnected(false);
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); }; }, []);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronLeft className="w-6 h-6" /></button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden"><img src={mockProviders[0].avatarUrl} alt="" className="w-full h-full object-cover" /></div>
            <div><h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{mockProviders[0].name}</h3><p className="text-xs text-neon-green">Online</p></div>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={() => startCall('audio')} className="p-2.5 rounded-full bg-neon-green/20 hover:bg-neon-green/30 transition-colors" title="Audio Call"><Phone className="w-5 h-5 text-neon-green" /></button>
            <button onClick={() => startCall('video')} className="p-2.5 rounded-full bg-neon-blue/20 hover:bg-neon-blue/30 transition-colors" title="Video Call"><Video className="w-5 h-5 text-neon-blue" /></button>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.isOwn ? 'bg-neon-blue/20 text-white' : theme === 'dark' ? 'bg-cyber-700/50 text-white' : 'bg-light-200 text-light-900'}`}>
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t p-4 safe-area-bottom ${theme === 'dark' ? 'bg-cyber-800/90 border-cyber-600/30' : 'bg-white/90 border-light-200'}`}>
        <div className="max-w-3xl mx-auto flex gap-3">
          <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="input-neon flex-1" />
          <button onClick={handleSend} className="btn-neon p-3"><Send className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Premium Video/Audio Call Overlay */}
      {showCall && (
        <div className="fixed inset-0 z-50 bg-cyber-900/98 flex flex-col animate-fade-in">
          {/* Remote video area (simulated) */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            {isVideoEnabled && callType === 'video' ? (
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-800 via-cyber-850 to-cyber-900">
                <div className="absolute inset-0 cyber-grid-bg opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center mb-4 animate-pulse-glow">
                      <span className="text-5xl font-bold text-cyber-900">{mockProviders[0].name.charAt(0)}</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{mockProviders[0].name}</h3>
                    <p className="text-gray-400 mt-1">{isCallConnected ? 'Connected' : 'Calling...'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center mb-6 animate-pulse-glow">
                  <span className="text-5xl font-bold text-cyber-900">{mockProviders[0].name.charAt(0)}</span>
                </div>
                <h3 className="text-2xl font-semibold text-white">{mockProviders[0].name}</h3>
                <p className="text-gray-400 mt-1">{isCallConnected ? 'Audio Call' : 'Calling...'}</p>
              </div>
            )}

            {/* Local video preview (picture-in-picture) */}
            {isVideoEnabled && callType === 'video' && isCallConnected && (
              <div className="absolute top-4 right-4 w-28 h-40 rounded-2xl overflow-hidden border-2 border-neon-blue/50 shadow-neon-blue animate-scale-in">
                <div className="w-full h-full bg-gradient-to-br from-cyber-700 to-cyber-800 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
                    <span className="text-lg font-bold text-cyber-900">{user.fullName.charAt(0)}</span>
                  </div>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/50 rounded text-xs text-white">You</div>
              </div>
            )}

            {/* Call timer */}
            {isCallConnected && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-neon-green/20 border border-neon-green/30 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-sm font-mono text-neon-green">{formatDuration(callDuration)}</span>
              </div>
            )}
          </div>

          {/* Call controls */}
          <div className={`p-6 backdrop-blur-xl border-t ${theme === 'dark' ? 'bg-cyber-800/90 border-cyber-600/30' : 'bg-white/90 border-light-200'} safe-area-bottom`}>
            <div className="max-w-md mx-auto flex items-center justify-center gap-4">
              {/* Mute toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isMuted ? 'bg-red-500/20 border border-red-500/50' : 'bg-cyber-700/50 border border-cyber-600/30 hover:bg-cyber-600/50'}`}
              >
                {isMuted ? <MicOff className="w-6 h-6 text-red-400" /> : <Mic className="w-6 h-6 text-white" />}
              </button>

              {/* Video toggle (only for video calls) */}
              {callType === 'video' && (
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${!isVideoEnabled ? 'bg-red-500/20 border border-red-500/50' : 'bg-cyber-700/50 border border-cyber-600/30 hover:bg-cyber-600/50'}`}
                >
                  {!isVideoEnabled ? <VideoOff className="w-6 h-6 text-red-400" /> : <Video className="w-6 h-6 text-white" />}
                </button>
              )}

              {/* End call */}
              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-500/30"
              >
                <PhoneCall className="w-7 h-7 text-white rotate-[135deg]" />
              </button>

              {/* Speaker toggle */}
              <button
                className="w-14 h-14 rounded-full bg-cyber-700/50 border border-cyber-600/30 hover:bg-cyber-600/50 flex items-center justify-center transition-all duration-300"
              >
                <Volume2 className="w-6 h-6 text-white" />
              </button>

              {/* Switch camera (video calls only) */}
              {callType === 'video' && (
                <button className="w-14 h-14 rounded-full bg-cyber-700/50 border border-cyber-600/30 hover:bg-cyber-600/50 flex items-center justify-center transition-all duration-300">
                  <Image className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== COMMUNICATIONS DASHBOARD ====================
const CommunicationsDashboard: React.FC<{ user: AppUser; onBack: () => void }> = ({ user, onBack }) => {
  const { theme } = useTheme();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(75);
  const [audioInput, setAudioInput] = useState('Default Microphone');
  const [audioOutput, setAudioOutput] = useState('Default Speakers');
  const [videoInput, setVideoInput] = useState('Default Camera');

  useEffect(() => {
    if (isInMeeting && isAudioEnabled) {
      const interval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 30) + 60);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isInMeeting, isAudioEnabled]);

  const startInstantMeeting = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMeetingCode(code);
    setIsConnecting(true);
    setTimeout(() => {
      setIsInMeeting(true);
      setIsConnecting(false);
    }, 2000);
  };

  const joinMeeting = () => {
    if (joinCode.trim()) {
      setIsConnecting(true);
      setTimeout(() => {
        setMeetingCode(joinCode.toUpperCase());
        setIsInMeeting(true);
        setIsConnecting(false);
        setJoinCode('');
      }, 2000);
    }
  };

  const leaveMeeting = () => {
    setIsInMeeting(false);
    setMeetingCode('');
    setIsScreenSharing(false);
  };

  return (
    <div className={`min-h-screen pb-8 ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-cyber-700/50 transition-colors">
            <ChevronLeft className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-blue/10">
              <Video className="w-6 h-6 text-neon-blue" />
            </div>
            <h1 className={`font-display text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
              Video Consultation
            </h1>
          </div>
          {isInMeeting && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-neon-green/20 border border-neon-green/30 rounded-full">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-sm font-medium text-neon-green">Live</span>
              <span className="text-sm text-gray-400">| Code: {meetingCode}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            <div className={`glass-card overflow-hidden ${theme === 'dark' ? '' : 'bg-white'}`}>
              {/* Video Stream Container */}
              <div className={`relative aspect-video ${theme === 'dark' ? 'bg-cyber-800' : 'bg-light-200'} flex items-center justify-center overflow-hidden`}>
                {isInMeeting ? (
                  <>
                    {/* Mock video stream with animation */}
                    <div className="absolute inset-0 cyber-grid-bg opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-cyan/5" />

                    {/* Simulated participant video */}
                    {isVideoEnabled ? (
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center animate-pulse-glow">
                          <span className="text-6xl font-bold text-cyber-900">{user.fullName.charAt(0)}</span>
                        </div>
                        <p className={`mt-4 text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{user.fullName}</p>
                        <p className="text-sm text-neon-green">Camera Active</p>
                      </div>
                    ) : (
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-40 h-40 rounded-full bg-cyber-700 flex items-center justify-center">
                          <VideoOff className="w-16 h-6 text-gray-500" />
                        </div>
                        <p className={`mt-4 text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{user.fullName}</p>
                        <p className="text-sm text-gray-500">Camera Off</p>
                      </div>
                    )}

                    {/* Screen sharing indicator */}
                    {isScreenSharing && (
                      <div className="absolute top-4 left-4 px-3 py-2 bg-neon-blue/20 border border-neon-blue/30 rounded-lg flex items-center gap-2 animate-pulse">
                        <Monitor className="w-4 h-4 text-neon-blue" />
                        <span className="text-sm text-neon-blue">Screen Sharing</span>
                      </div>
                    )}

                    {/* Audio level indicator */}
                    {isAudioEnabled && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-cyber-800/80 rounded-lg backdrop-blur-sm">
                        <Mic className="w-4 h-4 text-neon-green" />
                        <div className="w-24 h-2 bg-cyber-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan transition-all duration-200"
                            style={{ width: `${audioLevel}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Standby / Preview State */
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className={`w-32 h-32 rounded-full ${theme === 'dark' ? 'bg-cyber-700' : 'bg-light-300'} flex items-center justify-center mb-4 ${isConnecting ? 'animate-pulse' : ''}`}>
                      {isConnecting ? (
                        <div className="flex flex-col items-center">
                          <Radio className="w-12 h-12 text-neon-blue animate-spin" />
                          <p className="text-sm text-neon-blue mt-2">Connecting...</p>
                        </div>
                      ) : (
                        <Video className={`w-12 h-12 ${theme === 'dark' ? 'text-gray-500' : 'text-light-500'}`} />
                      )}
                    </div>
                    <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                      {isConnecting ? 'Starting meeting...' : 'Ready to start'}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'} mt-1`}>
                      {isConnecting ? 'Please wait while we connect you' : 'Start an instant meeting or join with a code'}
                    </p>
                  </div>
                )}
              </div>

              {/* Control Bar */}
              <div className={`p-4 border-t ${theme === 'dark' ? 'border-cyber-600/30 bg-cyber-800/50' : 'border-light-200 bg-light-50'}`}>
                <div className="flex items-center justify-center gap-3">
                  {/* Audio Toggle */}
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isAudioEnabled
                        ? 'bg-cyber-700/50 border border-cyber-600/30 hover:bg-cyber-600/50'
                        : 'bg-red-500/20 border border-red-500/50 hover:bg-red-500/30'
                    }`}
                    title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {isAudioEnabled ? (
                      <Mic className="w-5 h-5 text-neon-green" />
                    ) : (
                      <MicOff className="w-5 h-5 text-red-400" />
                    )}
                  </button>

                  {/* Video Toggle */}
                  <button
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isVideoEnabled
                        ? 'bg-cyber-700/50 border border-cyber-600/30 hover:bg-cyber-600/50'
                        : 'bg-red-500/20 border border-red-500/50 hover:bg-red-500/30'
                    }`}
                    title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isVideoEnabled ? (
                      <Video className="w-5 h-5 text-neon-blue" />
                    ) : (
                      <VideoOff className="w-5 h-5 text-red-400" />
                    )}
                  </button>

                  {/* Screen Share Toggle */}
                  <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isScreenSharing
                        ? 'bg-neon-blue/20 border border-neon-blue/50 hover:bg-neon-blue/30'
                        : 'bg-cyber-700/50 border border-cyber-600/30 hover:bg-cyber-600/50'
                    }`}
                    title={isScreenSharing ? 'Stop screen share' : 'Share screen'}
                  >
                    <Monitor className={`w-5 h-5 ${isScreenSharing ? 'text-neon-blue' : theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`} />
                  </button>

                  {/* End Call / Start Call */}
                  {isInMeeting ? (
                    <button
                      onClick={leaveMeeting}
                      className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-500/30"
                      title="Leave meeting"
                    >
                      <PhoneCall className="w-6 h-6 text-white rotate-[135deg]" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Meeting Actions */}
            {!isInMeeting && (
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <button
                  onClick={startInstantMeeting}
                  disabled={isConnecting}
                  className="btn-neon py-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Video className="w-6 h-6" />
                  Start Instant Meeting
                </button>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter meeting code..."
                    className="input-neon flex-1 uppercase"
                    maxLength={6}
                  />
                  <button
                    onClick={joinMeeting}
                    disabled={!joinCode.trim() || isConnecting}
                    className="btn-ghost flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Join
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Audio Diagnostics */}
          <div className="space-y-6">
            {/* Audio/Video Settings Panel */}
            <div className={`glass-card p-6 ${theme === 'dark' ? '' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                Device Settings
              </h3>

              {/* Audio Input */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                  <Headphones className="w-4 h-4 inline mr-2" />
                  Audio Input
                </label>
                <select
                  value={audioInput}
                  onChange={(e) => setAudioInput(e.target.value)}
                  className="input-neon"
                >
                  <option>Default Microphone</option>
                  <option>External USB Mic</option>
                  <option>Built-in Microphone</option>
                </select>
              </div>

              {/* Audio Output */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                  <Volume2 className="w-4 h-4 inline mr-2" />
                  Audio Output
                </label>
                <select
                  value={audioOutput}
                  onChange={(e) => setAudioOutput(e.target.value)}
                  className="input-neon"
                >
                  <option>Default Speakers</option>
                  <option>External Headphones</option>
                  <option>Built-in Speakers</option>
                </select>
              </div>

              {/* Video Input */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                  <Video className="w-4 h-4 inline mr-2" />
                  Camera
                </label>
                <select
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  className="input-neon"
                >
                  <option>Default Camera</option>
                  <option>External Webcam</option>
                  <option>Built-in Camera</option>
                </select>
              </div>
            </div>

            {/* Audio Diagnostics Panel */}
            <div className={`glass-card p-6 ${theme === 'dark' ? '' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                Audio Diagnostics
              </h3>

              {/* Input Level Meter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Input Level</span>
                  <span className={`text-sm font-mono ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{audioLevel}%</span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-cyber-700' : 'bg-light-300'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-blue transition-all duration-200"
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
              </div>

              {/* Frequency Spectrum (Simulated) */}
              <div className="mb-6">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Frequency Spectrum</span>
                <div className={`mt-2 h-16 rounded-lg ${theme === 'dark' ? 'bg-cyber-700/50' : 'bg-light-200'} p-2 flex items-end justify-around gap-1`}>
                  {[65, 80, 45, 90, 55, 70, 85, 40, 75, 60, 95, 50].map((height, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all duration-150 ${isAudioEnabled && isInMeeting ? 'bg-gradient-to-t from-neon-blue to-neon-cyan animate-pulse' : 'bg-gray-600'}`}
                      style={{ height: `${height}%`, animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Connection</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-sm text-neon-green">Excellent</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Bitrate</span>
                  <span className={`text-sm font-mono ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>2.4 Mbps</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Latency</span>
                  <span className={`text-sm font-mono ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>24 ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Sample Rate</span>
                  <span className={`text-sm font-mono ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>48 kHz</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Noise Gate</span>
                  <span className="text-sm text-neon-green">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {isInMeeting && (
              <div className={`glass-card p-6 ${theme === 'dark' ? 'border-neon-blue/30' : 'bg-white border-neon-blue/30'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                  Session Info
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Meeting ID</span>
                    <span className="text-sm font-mono text-neon-blue">{meetingCode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Participants</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>Recording</span>
                    <span className="text-sm text-gray-500">Not recording</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// ==================== PROFILE SCREEN ====================
const ProfileScreen: React.FC<{ user: AppUser; onBack: () => void; onLogout: () => void }> = ({ user, onBack, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={`min-h-screen pb-24 ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronLeft className="w-6 h-6" /></button>
          <h1 className={`font-display text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Profile</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center"><span className="text-4xl font-bold text-cyber-900">{user.fullName.charAt(0)}</span></div>
            <div className="text-center md:text-left flex-1"><h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{user.fullName}</h2><p className="text-gray-400">{user.email}</p></div>
          </div>
        </div>
        <div className="glass-card p-6 mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Settings</h3>
          <div className="flex items-center justify-between p-3 bg-cyber-700/30 rounded-lg">
            <span className={theme === 'dark' ? 'text-white' : 'text-light-900'}>Dark Mode</span>
            <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-neon-blue' : 'bg-light-400'}`}><div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} /></button>
          </div>
        </div>
        <button onClick={onLogout} className="w-full p-4 glass-card flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10"><LogOut className="w-5 h-5" />Sign Out</button>
      </main>
    </div>
  );
};

// ==================== SHOP SCREEN ====================
const ShopScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<'pharmacy' | 'apparel'>('pharmacy');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const allProducts = activeCategory === 'pharmacy' ? pharmacyProducts : apparelProducts;
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className={`min-h-screen pb-32 ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronLeft className="w-6 h-6" /></button>
            <h1 className={`font-display text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Shop</h1>
          </div>
          <button onClick={() => setShowCart(!showCart)} className="relative p-3 rounded-full bg-neon-blue/10">
            <ShoppingCart className="w-5 h-5 text-neon-blue" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-blue text-cyber-900 text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <button onClick={() => setActiveCategory('pharmacy')} className={`flex-1 px-4 py-3 rounded-xl ${activeCategory === 'pharmacy' ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' : 'bg-cyber-700/50 text-gray-400'}`}><Pill className="w-5 h-5 inline mr-2" />Pharmacy</button>
          <button onClick={() => setActiveCategory('apparel')} className={`flex-1 px-4 py-3 rounded-xl ${activeCategory === 'apparel' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' : 'bg-cyber-700/50 text-gray-400'}`}><Shirt className="w-5 h-5 inline mr-2" />Apparel</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allProducts.map((p) => (
            <div key={p.id} className="glass-card overflow-hidden">
              <div className="aspect-square"><img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /></div>
              <div className="p-3">
                <h3 className={`font-medium text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{p.name}</h3>
                <div className="flex items-center gap-2 mt-1"><span className="text-neon-blue font-bold">${p.price}</span>{p.originalPrice && <span className="text-gray-500 text-sm line-through">${p.originalPrice}</span>}</div>
                <button onClick={() => setCart([...cart, { ...p, quantity: 1 }])} className="mt-2 w-full py-2 rounded-lg text-sm bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      {showCart && (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <div className="glass-card w-full max-w-md p-6 animate-scale-in absolute right-0 top-0 bottom-0 rounded-none" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Cart ({cartCount})</h3><button onClick={() => setShowCart(false)}><X className="w-5 h-5" /></button></div>
            {cart.length === 0 ? <div className="text-center py-12 text-gray-400"><ShoppingCart className="w-12 h-12 mx-auto mb-3" /><p>Cart is empty</p></div> : (
              <><div className="space-y-3">{cart.map((item) => (
                <div key={item.id} className="flex gap-3 p-2 bg-cyber-700/50 rounded-lg">
                  <div className="w-16 h-16 rounded-lg overflow-hidden"><img src={item.imageUrl} alt="" className="w-full h-full object-cover" /></div>
                  <div className="flex-1"><p className="text-sm text-white">{item.name}</p><p className="text-neon-blue">${item.price}</p></div>
                </div>
              ))}</div><div className="mt-4 flex justify-between"><span className="text-gray-400">Total</span><span className="text-white font-bold">${cartTotal.toFixed(2)}</span></div><button className="btn-neon w-full mt-4">Checkout</button></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAPS SCREEN ====================
const MapsScreen: React.FC<{ user: AppUser; onBack: () => void; onSelectLocation: (loc: MapLocation) => void }> = ({ user, onBack }) => {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen pb-8 ${theme === 'dark' ? 'bg-cyber-900' : 'bg-light-100'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b safe-area-top ${theme === 'dark' ? 'bg-cyber-900/80 border-cyber-600/30' : 'bg-white/80 border-light-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-cyber-700/50"><ChevronLeft className="w-6 h-6" /></button>
          <div><h1 className={`font-display text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>Nearby</h1><p className="text-sm text-gray-400">{user.location?.city}</p></div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="glass-card p-4 mb-6">
          <div className="relative h-64 rounded-xl overflow-hidden bg-cyber-700 cyber-grid-bg">
            {mapLocations.map((loc, i) => {
              const positions = [{ top: '20%', left: '30%' }, { top: '40%', left: '60%' }];
              return <div key={loc.id} className="absolute w-8 h-8 rounded-full bg-cyber-800 border-2 border-neon-cyan flex items-center justify-center cursor-pointer" style={positions[i]}><MapPin className="w-4 h-4 text-neon-cyan" /></div>;
            })}
          </div>
        </div>
        <div className="space-y-3">
          {mapLocations.map((loc) => (
            <div key={loc.id} className="glass-card p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${loc.type === 'clinic' ? 'bg-neon-blue/10' : 'bg-neon-green/10'}`}><Medical className="w-6 h-6 text-neon-blue" /></div>
              <div className="flex-1">
                <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>{loc.name}</h4>
                <p className="text-sm text-gray-400">{loc.address}</p>
                <div className="flex items-center gap-3 mt-1"><span className="text-sm text-neon-blue">{loc.distance} km</span><span className="text-sm text-gray-400">{loc.eta}</span><span className="badge badge-success">Open</span></div>
              </div>
              <button className="btn-neon flex items-center gap-2"><Navigation className="w-4 h-4" />Navigate</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
