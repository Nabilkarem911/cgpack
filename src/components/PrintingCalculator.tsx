import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Printer } from 'lucide-react';

interface CalculatorState {
  pieceLength: string;
  pieceWidth: string;
  paperWeight: string;
  operationType: string;
  profitAmount: string;
  baseCost: number;
  totalCostWithProfit: number;
}

const PrintingCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    pieceLength: '',
    pieceWidth: '',
    paperWeight: '',
    operationType: '',
    profitAmount: '',
    baseCost: 0,
    totalCostWithProfit: 0
  });

  const operationTypes = [
    { value: 'one_face', label: 'طباعة وجه واحد' },
    { value: 'two_faces', label: 'طباعة وجهين' },
    { value: 'one_face_one_solv', label: 'طباعة وجه وسلوفان واحد' },
    { value: 'two_faces_one_solv', label: 'طباعة وجهين وسلوفان واحد' },
    { value: 'two_faces_two_solv', label: 'طباعة وجهين و2 سلوفان' },
    { value: 'one_face_two_solv', label: 'طباعة وجه واحد و2 سلوفان' }
  ];

  const calculateTotalCost = () => {
    const pieceLength = parseFloat(state.pieceLength);
    const pieceWidth = parseFloat(state.pieceWidth);
    const paperWeight = parseFloat(state.paperWeight);
    const profitAmount = parseFloat(state.profitAmount);

    if (isNaN(pieceLength) || isNaN(pieceWidth) || isNaN(paperWeight) || !state.operationType) {
      setState(prev => ({ ...prev, baseCost: 0, totalCostWithProfit: 0 }));
      return;
    }

    // الأبعاد الثابتة للشيت
    const sheetLength = 100;
    const sheetWidth = 70;

    // حساب عدد القطع بالطول والعرض مع تقريب النتيجة لأسفل
    const piecesLength = Math.floor(sheetLength / pieceLength);
    const piecesWidth = Math.floor(sheetWidth / pieceWidth);
    const totalPieces = piecesLength * piecesWidth;

    // حساب التكلفة الأساسية
    const baseCost = 0.7 * 1 * 1.05 * 4.4 * paperWeight;

    // إضافة تكلفة العملية
    let operationCost = 0;

    switch (state.operationType) {
      case 'one_face':
        operationCost = 0.9702;
        break;
      case 'two_faces':
        operationCost = 0.9702 + 0.2;
        break;
      case 'one_face_one_solv':
        operationCost = 0.9702 + 0.4;
        break;
      case 'two_faces_one_solv':
        operationCost = 0.9702 + 0.2 + 0.4;
        break;
      case 'two_faces_two_solv':
        operationCost = 0.9702 + 0.2 + 0.4 + 0.4;
        break;
      case 'one_face_two_solv':
        operationCost = 0.9702 + 0.4 + 0.4;
        break;
    }

    // حساب التكلفة لكل قطعة
    const costPerPiece = baseCost + operationCost;

    // حساب التكلفة الإجمالية بدون المكسب
    let totalCost = costPerPiece * totalPieces;

    // إضافة المكسب
    if (!isNaN(profitAmount)) {
      totalCost += profitAmount;
    }

    setState(prev => ({
      ...prev,
      baseCost: costPerPiece,
      totalCostWithProfit: totalCost
    }));
  };

  useEffect(() => {
    calculateTotalCost();
  }, [state.pieceLength, state.pieceWidth, state.paperWeight, state.operationType, state.profitAmount]);

  const handleInputChange = (field: keyof CalculatorState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold calculator-title">
              حاسبة تكلفة الطباعة
            </h1>
            <Printer className="h-8 w-8 text-accent" />
          </div>
          <p className="text-muted-foreground text-lg">
            احسب تكلفة الطباعة بدقة بناءً على أبعاد القطعة ونوع العملية
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-right text-2xl">المدخلات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="pieceLength" className="text-right block mb-2">
                    طول الورقة (سم)
                  </Label>
                  <Input
                    id="pieceLength"
                    type="number"
                    placeholder="ادخل طول الورقة بالسم"
                    value={state.pieceLength}
                    onChange={(e) => handleInputChange('pieceLength', e.target.value)}
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div>
                  <Label htmlFor="pieceWidth" className="text-right block mb-2">
                    عرض الورقة (سم)
                  </Label>
                  <Input
                    id="pieceWidth"
                    type="number"
                    placeholder="ادخل عرض الورقة بالسم"
                    value={state.pieceWidth}
                    onChange={(e) => handleInputChange('pieceWidth', e.target.value)}
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div>
                  <Label htmlFor="paperWeight" className="text-right block mb-2">
                    وزن الورقة (كيلو)
                  </Label>
                  <Input
                    id="paperWeight"
                    type="number"
                    step="0.1"
                    placeholder="ادخل وزن الورقة (مثل 0.3)"
                    value={state.paperWeight}
                    onChange={(e) => handleInputChange('paperWeight', e.target.value)}
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div>
                  <Label htmlFor="operationType" className="text-right block mb-2">
                    اختيار نوع الطباعة
                  </Label>
                  <Select
                    value={state.operationType}
                    onValueChange={(value) => handleInputChange('operationType', value)}
                    dir="rtl"
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختر نوع الطباعة" />
                    </SelectTrigger>
                    <SelectContent>
                      {operationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="profitAmount" className="text-right block mb-2">
                    المكسب (بالريال أو هللة)
                  </Label>
                  <Input
                    id="profitAmount"
                    type="number"
                    step="0.01"
                    placeholder="ادخل قيمة المكسب (مثل 0.5 ريال أو 50 هللة)"
                    value={state.profitAmount}
                    onChange={(e) => handleInputChange('profitAmount', e.target.value)}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="calculator-card">
              <CardHeader>
                <CardTitle className="text-right text-2xl">النتائج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-right block mb-2 text-muted-foreground">
                    التكلفة الأساسية للقطعة
                  </Label>
                  <div className="bg-muted p-4 rounded-lg text-right">
                    <span className="text-2xl font-bold text-primary">
                      {state.baseCost.toFixed(2)} ريال
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-right block mb-2 text-muted-foreground">
                    التكلفة مع المكسب
                  </Label>
                  <div className="result-card p-4 rounded-lg text-right">
                    <span className="text-2xl font-bold">
                      {state.totalCostWithProfit.toFixed(2)} ريال
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info Card */}
            <Card className="calculator-card">
              <CardHeader>
                <CardTitle className="text-right text-xl">معلومات إضافية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-right text-sm text-muted-foreground">
                  <p>• أبعاد الشيت الثابتة: 100×70 سم</p>
                  <p>• التكلفة تشمل المواد والعمليات المختارة</p>
                  <p>• المكسب يضاف على التكلفة الإجمالية</p>
                  <p>• جميع النتائج بالريال السعودي</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintingCalculator;