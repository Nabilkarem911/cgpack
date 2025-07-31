import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CalculatorState {
  pieceLength: string;
  pieceWidth: string;
  paperWeight: string;
  profitAmount: string;
}

interface PrintingType {
  name: string;
  extra: number;
}

const PrintingCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    pieceLength: '20',
    pieceWidth: '35',
    paperWeight: '0.3',
    profitAmount: '0'
  });

  const printingTypes: PrintingType[] = [
    { name: "طباعة وجه واحد", extra: 0 },
    { name: "طباعة وجهين", extra: 0.2 },
    { name: "وجه واحد + سلوفان واحد", extra: 0.4 },
    { name: "وجه واحد + 2 سلوفان", extra: 0.8 },
    { name: "وجهين + 1 سلوفان", extra: 0.6 },
    { name: "وجهين + 2 سلوفان", extra: 1.0 }
  ];

  const calculateResults = () => {
    const l = parseFloat(state.pieceLength);
    const w = parseFloat(state.pieceWidth);
    const weight = parseFloat(state.paperWeight);
    const profit = parseFloat(state.profitAmount) || 0;

    if (isNaN(l) || isNaN(w) || isNaN(weight)) {
      return [];
    }

    const sheetLength = 100;
    const sheetWidth = 70;
    const baseCost = 0.7 * 1 * 1.05 * 4.4 * weight;

    // الاتجاه 1
    const fit1X = Math.floor(sheetLength / l);
    const fit1Y = Math.floor(sheetWidth / w);
    const count1 = fit1X * fit1Y;

    // الاتجاه 2
    const fit2X = Math.floor(sheetLength / w);
    const fit2Y = Math.floor(sheetWidth / l);
    const count2 = fit2X * fit2Y;

    const bestCount = Math.max(count1, count2);
    const bestDirection = bestCount === count1 ? `${l} × ${w}` : `${w} × ${l}`;

    return printingTypes.map(type => {
      const totalCost = baseCost + type.extra;
      const costPerPiece = totalCost / bestCount;
      const costWithProfit = costPerPiece + profit;

      return {
        name: type.name,
        count: bestCount,
        direction: bestDirection,
        sheetCost: totalCost,
        pieceCost: costPerPiece,
        profitCost: costWithProfit
      };
    });
  };

  const handleInputChange = (field: keyof CalculatorState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="calculator-card">
          <CardHeader>
            <CardTitle className="text-right text-2xl">📦 حاسبة تكلفة الطباعة من الشيت (100 × 70)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="pieceLength" className="text-right block mb-2">
                  طول القطعة (سم):
                </Label>
                <Input
                  id="pieceLength"
                  type="number"
                  value={state.pieceLength}
                  onChange={(e) => handleInputChange('pieceLength', e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="pieceWidth" className="text-right block mb-2">
                  عرض القطعة (سم):
                </Label>
                <Input
                  id="pieceWidth"
                  type="number"
                  value={state.pieceWidth}
                  onChange={(e) => handleInputChange('pieceWidth', e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="paperWeight" className="text-right block mb-2">
                  وزن الورق (مثلاً: 0.3):
                </Label>
                <Input
                  id="paperWeight"
                  type="number"
                  step="0.01"
                  value={state.paperWeight}
                  onChange={(e) => handleInputChange('paperWeight', e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="profitAmount" className="text-right block mb-2">
                  المكسب لكل قطعة (ر.س):
                </Label>
                <Input
                  id="profitAmount"
                  type="number"
                  step="0.01"
                  value={state.profitAmount}
                  onChange={(e) => handleInputChange('profitAmount', e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-center">نوع الطباعة</th>
                    <th className="border border-border p-2 text-center">عدد القطع</th>
                    <th className="border border-border p-2 text-center">الاتجاه</th>
                    <th className="border border-border p-2 text-center">تكلفة الشيت (ر.س)</th>
                    <th className="border border-border p-2 text-center">تكلفة القطعة (ر.س)</th>
                    <th className="border border-border p-2 text-center">+ مكسب (ر.س)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="border border-border p-2 text-center">{result.name}</td>
                      <td className="border border-border p-2 text-center">{result.count}</td>
                      <td className="border border-border p-2 text-center">{result.direction}</td>
                      <td className="border border-border p-2 text-center">{result.sheetCost.toFixed(4)}</td>
                      <td className="border border-border p-2 text-center">{result.pieceCost.toFixed(4)}</td>
                      <td className="border border-border p-2 text-center">{result.profitCost.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrintingCalculator;