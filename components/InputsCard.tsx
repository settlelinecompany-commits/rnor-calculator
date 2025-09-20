"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Inputs, BlockChoice } from "@/types/rnor";
import { generateBlockYearRanges } from "@/lib/utils";

interface InputsCardProps {
  inputs: Inputs;
  onInputsChange: (inputs: Inputs) => void;
  onResetBlocks: () => void;
}

const SLIDER_OPTIONS = [
  { value: 'rarely', label: 'Rarely (0–60 days/year)', days: 60 },
  { value: 'sometimes', label: 'Sometimes (61–120 days/year)', days: 120 },
  { value: 'frequently', label: 'Often (121–180 days/year)', days: 180 },
  { value: 'mostly', label: 'Mostly (181–240 days/year)', days: 240 },
];

// Generate dynamic blocks with year ranges based on landing date
function getBlocksWithYearRanges(landingDate: string) {
  const yearRanges = generateBlockYearRanges(landingDate);
  
  // Format block B with arrow for 4-item range
  const blockBTitle = yearRanges.blockB.length > 0 
    ? `The 4 years before that (${yearRanges.blockB[0]} → ${yearRanges.blockB[yearRanges.blockB.length - 1]})`
    : 'The 4 years before that';
  
  return [
    {
      key: 'A' as const,
      title: `Last 3 years before landing (${yearRanges.blockA.join(', ')})`,
      description: 'In this period, how many days were you usually in India each year?',
      years: 3,
    },
    {
      key: 'B' as const,
      title: blockBTitle,
      description: 'In this period, how many days were you usually in India each year?',
      years: 4,
    },
    {
      key: 'C' as const,
      title: `Earlier 3 years (${yearRanges.blockC.join(', ')})`,
      description: 'In this period, how many days were you usually in India each year?',
      years: 3,
    },
  ];
}

interface BlockSliderProps {
  block: {
    key: 'A' | 'B' | 'C';
    title: string;
    description: string;
    years: number;
  };
  choice: BlockChoice;
  onChoiceChange: (choice: BlockChoice) => void;
}

function BlockSlider({ block, choice, onChoiceChange }: BlockSliderProps) {
  const currentIndex = SLIDER_OPTIONS.findIndex(opt => opt.value === choice);
  
  return (
    <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
      <div>
        <h4 className="font-semibold text-sm mb-1">{block.title}</h4>
        <p className="text-sm text-muted-foreground mb-2">{block.description}</p>
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

export function InputsCard({ inputs, onInputsChange }: InputsCardProps) {
  const blocks = getBlocksWithYearRanges(inputs.landingDate);
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


        {/* Residency Inputs - 3-4-3 Sliders */}
        <Card className="bg-muted/20">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold">Residency Inputs</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs text-muted-foreground cursor-help">ⓘ</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>A year here means Apr 1 to Mar 31.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Estimate your India stays across the last 10 years. Choose the option that best matches most years in each period.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={resetToDefault} className="text-sm text-muted-foreground">
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {/* Three Stacked Sliders */}
            {blocks.map((block) => (
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
