"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Inputs, BlockChoice } from "@/types/rnor";

interface InputsCardProps {
  inputs: Inputs;
  onInputsChange: (inputs: Inputs) => void;
  onRecalculate: () => void;
  onResetBlocks: () => void;
}

// Convert blocks to estimated days for slider
const estimateDaysFromBlocks = (blocks: Inputs['blocks']): number => {
  let totalDays = 0;
  
  // Block A (last 3 FYs)
  const aDays = blocks.A.choice === 'rarely' ? 30 : 
                blocks.A.choice === 'sometimes' ? 90 :
                blocks.A.choice === 'frequently' ? 150 : 240;
  totalDays += aDays * blocks.A.years;
  if (blocks.A.hasSpike) totalDays += 210;
  
  // Block B (previous 4 FYs)
  const bDays = blocks.B.choice === 'rarely' ? 30 : 
                blocks.B.choice === 'sometimes' ? 90 :
                blocks.B.choice === 'frequently' ? 150 : 240;
  totalDays += bDays * blocks.B.years;
  if (blocks.B.hasSpike) totalDays += 210;
  
  // Block C (previous 3 FYs)
  const cDays = blocks.C.choice === 'rarely' ? 30 : 
                blocks.C.choice === 'sometimes' ? 90 :
                blocks.C.choice === 'frequently' ? 150 : 240;
  totalDays += cDays * blocks.C.years;
  if (blocks.C.hasSpike) totalDays += 210;
  
  return Math.min(totalDays, 2000);
};

// Convert slider days back to blocks (simplified)
const convertDaysToBlocks = (days: number): Inputs['blocks'] => {
  const avgDaysPerYear = days / 10; // 10 years total
  
  let choice: BlockChoice = 'rarely';
  if (avgDaysPerYear >= 240) choice = 'mostly';
  else if (avgDaysPerYear >= 150) choice = 'frequently';
  else if (avgDaysPerYear >= 90) choice = 'sometimes';
  
  return {
    A: { choice, hasSpike: false, years: 3 },
    B: { choice, hasSpike: false, years: 4 },
    C: { choice, hasSpike: false, years: 3 },
  };
};

const DAY_CHIPS = [
  { label: "< 365 days", value: 300 },
  { label: "365–730 days", value: 550 },
  { label: "730–1200 days", value: 950 },
  { label: "1200+ days", value: 1500 },
];

export function InputsCard({ inputs, onInputsChange, onRecalculate }: InputsCardProps) {
  const updateInputs = (updates: Partial<Inputs>) => {
    onInputsChange({ ...inputs, ...updates });
  };

  const estimatedDays = estimateDaysFromBlocks(inputs.blocks);

  const handleDaysChange = (days: number) => {
    const newBlocks = convertDaysToBlocks(days);
    onInputsChange({
      ...inputs,
      blocks: newBlocks,
    });
  };

  const resetToDefault = () => {
    onInputsChange({
      ...inputs,
      blocks: {
        A: { choice: 'rarely', hasSpike: false, years: 3 },
        B: { choice: 'rarely', hasSpike: false, years: 4 },
        C: { choice: 'rarely', hasSpike: false, years: 3 },
      },
    });
  };

  return (
    <Card className="p-5 md:p-6 rounded-2xl shadow-sm">
      <CardContent className="space-y-6">
        {/* Basic Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="landing-date" className="text-base font-medium">Pick your return date</Label>
            <Input
              id="landing-date"
              type="date"
              value={inputs.landingDate}
              onChange={(e) => updateInputs({ landingDate: e.target.value })}
              className="text-base"
            />
            <p className="text-sm text-muted-foreground">
              We&apos;ll calculate when India starts taxing your worldwide income.
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="region" className="text-base font-medium">Where are you moving from?</Label>
            <Select
              value={inputs.region}
              onValueChange={(value: Inputs['region']) => updateInputs({ region: value })}
            >
              <SelectTrigger className="text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">US</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
                <SelectItem value="UAE">UAE</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              For context only, doesn&apos;t change calculations.
            </p>
          </div>
        </div>

        {/* Recalculate Button - Right Aligned */}
        <div className="flex justify-end">
          <Button onClick={onRecalculate} size="sm">
            Recalculate
          </Button>
        </div>

        {/* Simplified Accuracy Section */}
        <Card className="bg-muted/20">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">Improve accuracy (optional)</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Roughly how many days did you spend in India over the last 10 years?
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={resetToDefault} className="text-sm text-muted-foreground">
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {/* Slider */}
            <div className="space-y-3">
              <Slider
                value={[estimatedDays]}
                onValueChange={(value) => handleDaysChange(value[0])}
                max={2000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 days</span>
                <span className="font-medium">{estimatedDays} days</span>
                <span>2000+ days</span>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2">
              {DAY_CHIPS.map((chip) => (
                <Button
                  key={chip.value}
                  variant={Math.abs(estimatedDays - chip.value) < 100 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDaysChange(chip.value)}
                  className="text-sm"
                >
                  {chip.label}
                </Button>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              This affects how long your tax-free window lasts.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
