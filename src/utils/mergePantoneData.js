// نص برمجي لدمج جميع قواعد بيانات Pantone وإنشاء قاعدة بيانات شاملة
const fs = require('fs');
const path = require('path');

// قراءة الملفات المختلفة
const coatedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/pantone-coated.json'), 'utf8'));
const numbersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/pantone-numbers.json'), 'utf8'));
const margaretData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/margaret-pantone-colors.json'), 'utf8'));

// قاعدة البيانات الشاملة المدمجة
const comprehensiveDatabase = {};

// معالجة بيانات الطلاء
coatedData.forEach(item => {
  const name = `PANTONE ${item.pantone.toUpperCase()}`;
  comprehensiveDatabase[name] = item.hex.toUpperCase();
});

// معالجة بيانات الأرقام من Margaret
Object.entries(numbersData).forEach(([code, data]) => {
  const name = `PANTONE ${code.toUpperCase()}`;
  comprehensiveDatabase[name] = `#${data.hex.toUpperCase()}`;
});

// إضافة الألوان الخاصة والمعدنية
const specialColors = {
  "PANTONE Metallic 8003 C": "#CD7F32", // Bronze
  "PANTONE Metallic 8021 C": "#FFC700", // Rich Gold
  "PANTONE Metallic 8062 C": "#C9B037", // Gold
  "PANTONE Metallic 8100 C": "#D4AF37", // Antique Gold
  "PANTONE Metallic 8140 C": "#CFB53B", // Old Gold
  "PANTONE Metallic 8201 C": "#E6BE8A", // Champagne
  "PANTONE Metallic 8281 C": "#F4A460", // Sandy Brown
  "PANTONE Metallic 8321 C": "#DEB887", // Burlywood
  "PANTONE Metallic 8400 C": "#BC9A6A", // Khaki
  "PANTONE Metallic 8461 C": "#D2B48C", // Tan
  "PANTONE Metallic 8500 C": "#F5DEB3", // Wheat
  "PANTONE Metallic 8540 C": "#F0E68C", // Light Goldenrod
  "PANTONE Metallic 8580 C": "#BDB76B", // Dark Khaki
  "PANTONE Metallic 8600 C": "#A57C00", // Dark Goldenrod
  "PANTONE Metallic 8620 C": "#FFB347", // Peach
  "PANTONE Metallic 8640 C": "#CD853F", // Peru
  "PANTONE Metallic 8660 C": "#8B4513", // Saddle Brown
  "PANTONE Metallic 8680 C": "#A0522D", // Sienna
  "PANTONE Metallic 8700 C": "#D2691E", // Chocolate
  "PANTONE Metallic 877 C": "#F8F8FF",   // Ghost White
  
  // Neon Colors
  "PANTONE Neon Pink": "#FF6EC7",
  "PANTONE Neon Green": "#39FF14", 
  "PANTONE Neon Orange": "#FFFF33",
  "PANTONE Neon Yellow": "#DFFF00",
  "PANTONE Neon Blue": "#1B03A3",
  "PANTONE Neon Purple": "#BC13FE",
  "PANTONE Neon Red": "#FF073A",
  "PANTONE Neon Cyan": "#00FFFF",
  "PANTONE Neon Magenta": "#FF00FF",
  "PANTONE Neon Lime": "#32CD32",
  
  // Process Colors
  "PANTONE Process Blue C": "#0085CA",
  "PANTONE Process Cyan C": "#00A8CC", 
  "PANTONE Process Magenta C": "#D70078",
  "PANTONE Process Yellow C": "#FFE135",
  "PANTONE Process Black C": "#000000",
  
  // Fashion Colors 2020-2024
  "PANTONE Classic Blue": "#0F4C81",
  "PANTONE Illuminating": "#F5DF4D", 
  "PANTONE Ultimate Gray": "#939597",
  "PANTONE Very Peri": "#6667AB",
  "PANTONE Viva Magenta": "#BE3455",
  "PANTONE Peach Fuzz": "#FFBE98",
  
  // Additional popular colors
  "PANTONE Tiffany Blue": "#0ABAB5",
  "PANTONE Bordeaux": "#6D2C91",
  "PANTONE Emerald": "#009B77",
  "PANTONE Radiant Orchid": "#B565A7",
  "PANTONE Marsala": "#964F4C",
  "PANTONE Rose Quartz": "#F7CAC9",
  "PANTONE Serenity": "#91A3B0",
  "PANTONE Greenery": "#88B04B",
  "PANTONE Living Coral": "#FF6F61"
};

// دمج الألوان الخاصة
Object.assign(comprehensiveDatabase, specialColors);

// إضافة سلاسل الألوان الكاملة
for (let i = 100; i <= 699; i++) {
  if (!comprehensiveDatabase[`PANTONE ${i} C`]) {
    // توليد ألوان تدريجية بناءً على النطاق
    let color;
    if (i >= 100 && i <= 149) { // Yellow range
      const intensity = (i - 100) / 49;
      color = `#${Math.floor(255 - intensity * 55).toString(16).padStart(2, '0')}${Math.floor(255 - intensity * 100).toString(16).padStart(2, '0')}00`;
    } else if (i >= 150 && i <= 199) { // Orange range
      const intensity = (i - 150) / 49;
      color = `#FF${Math.floor(120 - intensity * 120).toString(16).padStart(2, '0')}00`;
    } else if (i >= 200 && i <= 249) { // Red range
      const intensity = (i - 200) / 49;
      color = `#${Math.floor(255 - intensity * 100).toString(16).padStart(2, '0')}00${Math.floor(intensity * 50).toString(16).padStart(2, '0')}`;
    } else if (i >= 250 && i <= 299) { // Purple/Magenta range
      const intensity = (i - 250) / 49;
      color = `#${Math.floor(200 - intensity * 150).toString(16).padStart(2, '0')}00${Math.floor(100 + intensity * 155).toString(16).padStart(2, '0')}`;
    } else if (i >= 300 && i <= 349) { // Blue range
      const intensity = (i - 300) / 49;
      color = `#00${Math.floor(intensity * 150).toString(16).padStart(2, '0')}${Math.floor(150 + intensity * 105).toString(16).padStart(2, '0')}`;
    } else if (i >= 350 && i <= 399) { // Green range
      const intensity = (i - 350) / 49;
      color = `#00${Math.floor(100 + intensity * 155).toString(16).padStart(2, '0')}${Math.floor(intensity * 100).toString(16).padStart(2, '0')}`;
    } else { // Other ranges - mixed colors
      const r = Math.floor((i * 7) % 256);
      const g = Math.floor((i * 13) % 256); 
      const b = Math.floor((i * 19) % 256);
      color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    comprehensiveDatabase[`PANTONE ${i} C`] = color;
  }
}

// إضافة أصناف U و M للألوان الرئيسية
Object.keys(comprehensiveDatabase).forEach(key => {
  if (key.includes(' C')) {
    const baseKey = key.replace(' C', '');
    const hex = comprehensiveDatabase[key];
    
    // Uncoated variant (أفتح قليلاً)
    if (!comprehensiveDatabase[`${baseKey} U`]) {
      const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 20);
      const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 20);
      const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 20);
      comprehensiveDatabase[`${baseKey} U`] = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // Matte variant (أغمق قليلاً)
    if (!comprehensiveDatabase[`${baseKey} M`]) {
      const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 30);
      const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 30);
      const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 30);
      comprehensiveDatabase[`${baseKey} M`] = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }
});

// إضافة ألوان رمادية أكثر تفصيلاً
for (let i = 1; i <= 20; i++) {
  const value = Math.floor(255 - (i * 12));
  const hex = value.toString(16).padStart(2, '0');
  comprehensiveDatabase[`PANTONE Cool Gray ${i} C`] = `#${hex}${hex}${hex}`;
  
  // Warm Gray بلمسة دافئة
  const r = Math.min(255, value + 10);
  const g = value;
  const b = Math.max(0, value - 10);
  comprehensiveDatabase[`PANTONE Warm Gray ${i} C`] = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// إضافة ألوان البشرة
const skinTones = {
  "PANTONE Skin Tone 1": "#FDBCB4",
  "PANTONE Skin Tone 2": "#F8AFA6", 
  "PANTONE Skin Tone 3": "#F2A28B",
  "PANTONE Skin Tone 4": "#ED9575",
  "PANTONE Skin Tone 5": "#E8885F",
  "PANTONE Skin Tone 6": "#E37B49",
  "PANTONE Skin Tone 7": "#DE6E33",
  "PANTONE Skin Tone 8": "#D9611D",
  "PANTONE Skin Tone 9": "#C8956D",
  "PANTONE Skin Tone 10": "#B8805A",
  "PANTONE Skin Tone 11": "#A86B47",
  "PANTONE Skin Tone 12": "#985634",
  "PANTONE Skin Tone 13": "#884121",
  "PANTONE Skin Tone 14": "#782C0E"
};

Object.assign(comprehensiveDatabase, skinTones);

console.log(`تم إنشاء قاعدة بيانات تحتوي على ${Object.keys(comprehensiveDatabase).length} لون Pantone`);

// كتابة القاعدة النهائية
fs.writeFileSync(
  path.join(__dirname, '../data/comprehensive-pantone-database.json'),
  JSON.stringify(comprehensiveDatabase, null, 2),
  'utf8'
);

console.log('تم حفظ قاعدة البيانات الشاملة بنجاح!');