import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export default function FAQForm() {
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  const handleChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(faqs);
    alert(`Submitted ${faqs.length} FAQs!`);
  };

  return (
    <div className="">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                <div>
                  <Label htmlFor={`question-${index}`}>Question</Label>
                  <Input
                    id={`question-${index}`}
                    placeholder="Enter your question"
                    value={faq.question}
                    onChange={(e) => handleChange(index, "question", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor={`answer-${index}`}>Answer</Label>
                  <Textarea
                    id={`answer-${index}`}
                    placeholder="Enter your answer"
                    value={faq.answer}
                    onChange={(e) => handleChange(index, "answer", e.target.value)}
                    required
                  />
                </div>

                {faqs.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFaq(index)}
                    className="absolute top-2 right-2 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                )}
              </div>
            ))}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddFaq}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add More FAQ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
