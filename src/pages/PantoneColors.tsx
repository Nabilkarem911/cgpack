import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pantoneData from '@/data/mega-pantone-database.json';

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

  // Categorize colors
  const categorizeColor = (color: PantoneColor): string => {
    const { r, g, b } = color.rgb;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    // Check for metallic/special colors in name
    if (color.name.toLowerCase().includes('metallic') || 
        color.name.toLowerCase().includes('gold') || 
        color.name.toLowerCase().includes('silver')) {
      return 'metallic';
    }
    
    // Check for pastel colors (high lightness, low saturation)
    if (min > 150 && diff < 100) {
      return 'pastel';
    }
    
    // Determine dominant color
    if (r > g && r > b) return 'red';
    if (g > r && g > b) return 'green';
    if (b > r && b > g) return 'blue';
    if (r > 200 && g > 200 && b < 100) return 'yellow';
    if (r > 150 && g < 100 && b > 150) return 'purple';
    if (r > 200 && g > 100 && b < 100) return 'orange';
    if (r < 100 && g < 100 && b < 100) return 'black';
    if (r > 200 && g > 200 && b > 200) return 'white';
    
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
              {filteredColors.slice(0, 200).map((color, index) => (
                <ColorCard key={index} color={color} />
              ))}
            </div>
            
            {filteredColors.length > 200 && (
              <div className="text-center text-muted-foreground text-sm">
                عرض أول 200 لون من {filteredColors.length} - استخدم البحث للوصول لألوان محددة
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
    </div>
  );
};

export default PantoneColors;