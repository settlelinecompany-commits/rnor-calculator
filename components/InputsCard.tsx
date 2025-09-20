"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Inputs, BlockChoice } from "@/types/rnor";

interface InputsCardProps {
  inputs: Inputs;
  onInputsChange: (inputs: Inputs) => void;
  onRecalculate: () => void;
}

const BLOCK_CHOICES: { value: BlockChoice; label: string; days: string }[] = [
  { value: 'rarely', label: 'Rarely', days: '30d' },
  { value: 'sometimes', label: 'Sometimes', days: '90d' },
  { value: 'frequently', label: 'Frequently', days: '150d' },
  { value: 'mostly', label: 'Mostly', days: '240d' },
];

const BLOCKS = [
  {
    key: 'A' as const,
    title: 'Last 3 FYs',
    description: 'Most recent before return',
  },
  {
    key: 'B' as const,
    title: 'Previous 4 FYs',
    description: 'Middle period abroad',
  },
  {
    key: 'C' as const,
    title: 'Previous 3 FYs',
    description: 'Earlier years abroad',
  },
];

interface BlockCardletProps {
  block: typeof BLOCKS[0];
  choice: BlockChoice;
  hasSpike: boolean;
  onChoiceChange: (choice: BlockChoice) => void;
  onSpikeChange: (hasSpike: boolean) => void;
}

function BlockCardlet({ block, choice, hasSpike, onChoiceChange, onSpikeChange }: BlockCardletProps) {
  return (
    <div className="bg-muted/30 border rounded-lg p-3 md:p-4 space-y-3">
      <div>
        <h4 className="text-sm font-bold">{block.title}</h4>
        <p className="text-xs text-muted-foreground">{block.description}</p>
      </div>
      
      <ToggleGroup
        type="single"
        value={choice}
        onValueChange={(value) => value && onChoiceChange(value as BlockChoice)}
        className="grid grid-cols-2 gap-1"
      >
        {BLOCK_CHOICES.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            variant="outline"
            size="sm"
            className="flex flex-col items-center p-2 h-auto"
          >
            <span className="text-xs font-medium">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.days}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      
      <div className="flex items-center space-x-2 pt-2 border-t">
        <Switch
          id={`spike-${block.key}`}
          checked={hasSpike}
          onCheckedChange={onSpikeChange}
          className="scale-75"
        />
        <Label htmlFor={`spike-${block.key}`} className="text-xs">
          Any 6+ month year?
        </Label>
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

  const resetBlocks = () => {
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
      <CardContent className="space-y-4">
        {/* Basic Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="landing-date">Landing date in India</Label>
            <Input
              id="landing-date"
              type="date"
              value={inputs.landingDate}
              onChange={(e) => updateInputs({ landingDate: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Pick your landing date (the day you arrive in India). We&apos;ll do FY math for you.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select
              value={inputs.region}
              onValueChange={(value: Inputs['region']) => updateInputs({ region: value })}
            >
              <SelectTrigger>
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
            <p className="text-xs text-muted-foreground">
              For copy only (doesn&apos;t change calculations). Helps personalize tips.
            </p>
          </div>
        </div>

        {/* Recalculate Button - Right Aligned */}
        <div className="flex justify-end">
          <Button onClick={onRecalculate}>
            Recalculate
          </Button>
        </div>

        {/* Improve Accuracy Section */}
        <Card className="bg-muted/20">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">Improve accuracy (optional)</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Answer a few quick questions about past India stays for better accuracy.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={resetBlocks} className="text-xs text-muted-foreground">
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* 3-Column Grid of Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BLOCKS.map((block) => (
                <BlockCardlet
                  key={block.key}
                  block={block}
                  choice={inputs.blocks[block.key].choice}
                  hasSpike={inputs.blocks[block.key].hasSpike}
                  onChoiceChange={(choice) => updateBlock(block.key, { choice })}
                  onSpikeChange={(hasSpike) => updateBlock(block.key, { hasSpike })}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
