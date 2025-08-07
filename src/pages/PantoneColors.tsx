import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Filter, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pantoneData from '@/data/ultimate-pantone-database.json';

interface PantoneColor {
  name: string;
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
}

const PantoneColors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [displayedColors, setDisplayedColors] = useState(50);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Convert the JSON data to our interface
  const pantoneColors: PantoneColor[] = useMemo(() => {
    return Object.entries(pantoneData as Record<string, string>).map(([name, hex]) => {
      // Convert hex to RGB
      const hexValue = hex.replace('#', '');
      const r = parseInt(hexValue.substr(0, 2), 16);
      const g = parseInt(hexValue.substr(2, 2), 16);
      const b = parseInt(hexValue.substr(4, 2), 16);
      
      return {
        name,
        hex,
        rgb: { r, g, b }
      };
    });
  }, []);

  // Enhanced color categorization function with improved accuracy
  const categorizeColor = (color: PantoneColor): string => {
    const { r, g, b } = color.rgb;
    const name = color.name.toLowerCase();
    
    // Check for metallic/special colors in name
    if (name.includes('metallic') || name.includes('gold') || name.includes('silver') ||
        name.includes('copper') || name.includes('bronze') || name.includes('pewter') ||
        name.includes('aluminum') || name.includes('titanium') || name.includes('chrome') ||
        name.includes('platinum')) {
      return 'metallic';
    }
    
    // Check for black colors
    if (name.includes('black') || name.includes('gray') || name.includes('grey') || 
        (r < 80 && g < 80 && b < 80)) {
      return 'black';
    }
    
    // Check for white colors
    if (name.includes('white') || (r > 220 && g > 220 && b > 220)) {
      return 'white';
    }
    
    // Convert RGB to HSL for better color classification
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;
    
    const lightness = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    
    let hue = 0;
    if (delta !== 0) {
      switch (max) {
        case rNorm:
          hue = ((gNorm - bNorm) / delta) % 6;
          break;
        case gNorm:
          hue = (bNorm - rNorm) / delta + 2;
          break;
        case bNorm:
          hue = (rNorm - gNorm) / delta + 4;
          break;
      }
      hue = hue * 60;
      if (hue < 0) hue += 360;
    }
    
    // Check for pastel colors (high lightness, low saturation)
    if (lightness > 0.75 && saturation < 0.4) {
      return 'pastel';
    }
    
    // Low saturation means gray/neutral colors
    if (saturation < 0.15) {
      if (lightness < 0.3) return 'black';
      if (lightness > 0.8) return 'white';
      return 'other';
    }
    
    // Classify by hue ranges with better precision
    if (hue >= 0 && hue < 15) return 'red';       // Pure red
    if (hue >= 15 && hue < 45) return 'orange';   // Red-orange to orange
    if (hue >= 45 && hue < 75) return 'yellow';   // Orange-yellow to yellow
    if (hue >= 75 && hue < 165) return 'green';   // Yellow-green to green
    if (hue >= 165 && hue < 255) return 'blue';   // Green-blue to blue
    if (hue >= 255 && hue < 285) return 'purple'; // Blue-purple to purple
    if (hue >= 285 && hue < 330) return 'purple'; // Purple to red-purple
    if (hue >= 330 && hue <= 360) return 'red';   // Red-purple to red
    
    return 'other';
  };

  // Filter colors based on search and category
  const filteredColors = useMemo(() => {
    return pantoneColors.filter(color => {
      const matchesSearch = searchTerm === '' || 
        color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        color.hex.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || categorizeColor(color) === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [pantoneColors, searchTerm, selectedCategory]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        if (displayedColors < filteredColors.length) {
          setDisplayedColors(prev => Math.min(prev + 50, filteredColors.length));
        }
      }
      
      // Show/hide scroll to top button
      setShowScrollToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredColors.length, displayedColors]);

  // Reset displayed colors when filters change
  useEffect(() => {
    setDisplayedColors(50);
  }, [searchTerm, selectedCategory]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ColorCard = ({ color }: { color: PantoneColor }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-4">
        <div 
          className="w-full h-20 rounded-lg mb-3 border border-border shadow-inner"
          style={{ backgroundColor: color.hex }}
        />
        <div className="space-y-2 text-sm">
          <div className="font-semibold text-card-foreground truncate" title={color.name}>
            {color.name}
          </div>
          <div className="text-muted-foreground">
            <div className="font-mono">{color.hex}</div>
            <div className="font-mono text-xs">
              RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="calculator-card mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                العودة للحاسبة
              </Button>
              <CardTitle className="text-right text-2xl">🎨 ألوان Pantone</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filter Section */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بكود Pantone، HEX، أو اللون..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-right"
                  dir="rtl"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر فئة اللون" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الألوان</SelectItem>
                    <SelectItem value="red">أحمر</SelectItem>
                    <SelectItem value="blue">أزرق</SelectItem>
                    <SelectItem value="green">أخضر</SelectItem>
                    <SelectItem value="yellow">أصفر</SelectItem>
                    <SelectItem value="purple">بنفسجي</SelectItem>
                    <SelectItem value="orange">برتقالي</SelectItem>
                    <SelectItem value="pastel">باستيل</SelectItem>
                    <SelectItem value="metallic">معدني</SelectItem>
                    <SelectItem value="black">أسود</SelectItem>
                    <SelectItem value="white">أبيض</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center text-muted-foreground">
              عرض {filteredColors.length} من أصل {pantoneColors.length} لون
            </div>

            {/* Colors Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {filteredColors.slice(0, displayedColors).map((color, index) => (
                <ColorCard key={index} color={color} />
              ))}
            </div>
            
            {displayedColors < filteredColors.length && (
              <div className="text-center text-muted-foreground text-sm">
                عرض {displayedColors} من أصل {filteredColors.length} لون - انزل للأسفل لتحميل المزيد
              </div>
            )}
            
            {displayedColors >= filteredColors.length && filteredColors.length > 50 && (
              <div className="text-center text-muted-foreground text-sm">
                تم عرض جميع الألوان ({filteredColors.length} لون)
              </div>
            )}

            {filteredColors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg">
                  لم يتم العثور على ألوان مطابقة للبحث
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  مسح الفلاتر
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default PantoneColors;