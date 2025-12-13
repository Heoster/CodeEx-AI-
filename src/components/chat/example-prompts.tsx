import {Card, CardContent} from '@/components/ui/card';
import {Code, Calculator, Search, FileText, Sparkles} from 'lucide-react';

interface ExamplePromptsProps {
  onSendMessage: (message: string) => void;
}

const prompts = [
  {
    icon: <Search className="h-5 w-5" />,
    text: 'What are the top AI trends to watch in 2026?',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: <Code className="h-5 w-5" />,
    text: 'Best Future-proof skill to learn in 2026?',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: <Calculator className="h-5 w-5" />,
    text: 'Solve the equation: 2x^2 + 3x - 5 = 0',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    text: 'Summarize coding in 3 concise bullet points.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

export function ExamplePrompts({onSendMessage}: ExamplePromptsProps) {
  return (
    <div className="mx-auto max-w-4xl animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span className="font-medium">Try these examples</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prompts.map((prompt, index) => (
          <Card
            key={index}
            className="group cursor-pointer border-2 transition-all duration-200 hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => onSendMessage(prompt.text)}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div className={`flex-shrink-0 rounded-xl p-2.5 ${prompt.bgColor} ${prompt.color} transition-transform group-hover:scale-110`}>
                {prompt.icon}
              </div>
              <div className="flex-1 text-sm leading-relaxed pt-1">
                {prompt.text}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
