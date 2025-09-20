"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Inputs, BlockChoice } from "@/types/rnor";

interface InputsCardProps {
  inputs: Inputs;
  onInputsChange: (inputs: Inputs) => void;
  onRecalculate: () => void;
}

const BLOCK_CHOICES: { value: BlockChoice; label: string; description: string }[] = [
  { value: 'rarely', label: 'Rarely (0–1 mo)', description: '30 days' },
  { value: 'sometimes', label: 'Sometimes (2–3 mo)', description: '90 days' },
  { value: 'frequently', label: 'Frequently (4–6 mo)', description: '150 days' },
  { value: 'mostly', label: 'Mostly (7+ mo)', description: '240 days' },
];

const BLOCKS = [
  {
    key: 'A' as const,
    title: 'Last 3 FYs before landing',
    description: 'Most recent years before your return.',
  },
  {
    key: 'B' as const,
    title: 'Previous 4 FYs',
    description: 'Middle period of your time abroad.',
  },
  {
    key: 'C' as const,
    title: 'Previous 3 FYs',
    description: 'Earlier years of your time abroad.',
  },
];

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
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your RNOR Settings</CardTitle>
      </CardHeader>
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

        {/* Recalculate Button */}
        <div className="flex justify-center">
          <Button onClick={onRecalculate}>
            Recalculate
          </Button>
        </div>

        {/* Accuracy Blocks - Always Visible */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Improve accuracy</h3>
            <Button variant="ghost" size="sm" onClick={resetBlocks} className="text-sm">
              Reset all blocks to default
            </Button>
          </div>
          
          {BLOCKS.map((block) => (
            <div key={block.key} className="space-y-3 p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{block.title}</h4>
                <p className="text-sm text-muted-foreground">{block.description}</p>
              </div>
              
              <div className="space-y-2">
                <Label>How many months did you usually spend in India each year?</Label>
                <Select
                  value={inputs.blocks[block.key].choice}
                  onValueChange={(value: BlockChoice) => updateBlock(block.key, { choice: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOCK_CHOICES.map((choice) => (
                      <SelectItem key={choice.value} value={choice.value}>
                        <div>
                          <div>{choice.label}</div>
                          <div className="text-xs text-muted-foreground">{choice.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id={`spike-${block.key}`}
                  checked={inputs.blocks[block.key].hasSpike}
                  onCheckedChange={(checked) => updateBlock(block.key, { hasSpike: checked })}
                />
                <Label htmlFor={`spike-${block.key}`} className="text-sm">
                  Any year in this block you stayed 6+ months?
                </Label>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
