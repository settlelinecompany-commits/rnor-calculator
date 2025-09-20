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

const SLIDER_OPTIONS = [
  { value: 'rarely', label: 'Rarely (0–60 days)', days: 60 },
  { value: 'sometimes', label: 'Sometimes (61–120 days)', days: 120 },
  { value: 'frequently', label: 'Often (121–180 days)', days: 180 },
  { value: 'mostly', label: 'Mostly (181–240 days)', days: 240 },
];

const BLOCKS = [
  {
    key: 'A' as const,
    title: 'Last 3 FYs',
    description: 'In the last 3 years before moving back, how many days did you usually spend in India each year?',
    years: 3,
  },
  {
    key: 'B' as const,
    title: 'The 4 FYs before that',
    description: 'In the 4 years before that, how many days were you usually in India each year?',
    years: 4,
  },
  {
    key: 'C' as const,
    title: 'The 3 FYs before that',
    description: 'And in the 3 years before that, how many days were you usually in India each year?',
    years: 3,
  },
];

interface BlockSliderProps {
  block: typeof BLOCKS[0];
  choice: BlockChoice;
  onChoiceChange: (choice: BlockChoice) => void;
}

function BlockSlider({ block, choice, onChoiceChange }: BlockSliderProps) {
  const currentIndex = SLIDER_OPTIONS.findIndex(opt => opt.value === choice);
  
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
      <div>
        <h4 className="font-semibold text-sm mb-1">{block.title}</h4>
        <p className="text-sm text-muted-foreground mb-3">{block.description}</p>
        <p className="text-xs text-muted-foreground mb-3">
          Choose the option that best matches most years in this period.
        </p>
      </div>
      
      {/* Slider */}
      <div className="space-y-3">
        <Slider
          value={[currentIndex]}
          onValueChange={(value) => onChoiceChange(SLIDER_OPTIONS[value[0]].value as BlockChoice)}
          max={SLIDER_OPTIONS.length - 1}
          step={1}
          className="w-full"
        />
        
        {/* Slider Labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          {SLIDER_OPTIONS.map((option, index) => (
            <div key={option.value} className="text-center">
              <div className={`font-medium ${index === currentIndex ? 'text-foreground' : ''}`}>
                {option.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InputsCard({ inputs, onInputsChange, onRecalculate }: InputsCardProps) {
  const updateInputs = (updates: Partial<Inputs>) => {
    onInputsChange({ ...inputs, ...updates });
  };

  const updateBlock = (blockKey: keyof Inputs['blocks'], updates: Partial<Inputs['blocks'][keyof Inputs['blocks']]>) => {
    onInputsChange({
      ...inputs,
      blocks: {
        ...inputs.blocks,
        [blockKey]: { ...inputs.blocks[blockKey], ...updates },
      },
    });
  };

  const resetToDefault = () => {
    onInputsChange({
      ...inputs,
      blocks: {
        A: { choice: 'sometimes', years: 3 },
        B: { choice: 'sometimes', years: 4 },
        C: { choice: 'sometimes', years: 3 },
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
            <Label htmlFor="region" className="text-base font-medium">Which country are you moving from?</Label>
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
          <Button onClick={onRecalculate} className="bg-green-600 hover:bg-green-700">
            Recalculate
          </Button>
        </div>

        {/* Residency Inputs - 3-4-3 Sliders */}
        <Card className="bg-muted/20">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">Improve accuracy</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Estimate your India stays across the last 10 years
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={resetToDefault} className="text-sm text-muted-foreground">
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            {/* Three Stacked Sliders */}
            {BLOCKS.map((block) => (
              <BlockSlider
                key={block.key}
                block={block}
                choice={inputs.blocks[block.key].choice}
                onChoiceChange={(choice) => updateBlock(block.key, { choice })}
              />
            ))}
            
            {/* Conservatism Note */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                We use the upper end of each range to stay conservative and avoid overstating tax-free years.
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
