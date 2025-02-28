"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
// import { useToast } from "@/components/ui/toast";
import { ToastContainer, toast } from "react-toastify";
import { useGetAgents } from "@/hooks/agent";
import { useSendMessage } from "@/hooks/send-message";

type FormStep = {
  title: string;
  description: string;
};

const formSteps: FormStep[] = [
  {
    title: "Risk Tolerance",
    description: "How much risk are you comfortable with?",
  },
  {
    title: "Investment Budget",
    description: "How much are you planning to invest?",
  },
  {
    title: "Return Expectations",
    description: "What are your target returns?",
  },
  {
    title: "Investment Timeline",
    description: "How long do you plan to hold your investments?",
  },
  {
    title: "DeFi Experience",
    description: "How familiar are you with DeFi?",
  },
  {
    title: "Review",
    description: "Review your investment profile",
  },
];

export function InvestmentProfileForm() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { mutateAsync } = useSendMessage();
  //   const { toast } = useToast();
  const { data } = useGetAgents();

  const [formData, setFormData] = React.useState({
    riskTolerance: "",
    investmentBudget: "",
    targetReturn: 20,
    timeline: "",
    defiExperience: "",
  });

  const progress = ((currentStep + 1) / formSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    const prompt = `Create investment for me where my risk tolerance is ${formData.riskTolerance} and my investment budget is ${formData.investmentBudget} EGLD and my annual target returns 
    is ${formData.targetReturn}% and my investment timeline is ${formData.timeline}. My experience in DeFi is ${formData.defiExperience}.`;

    const response = await mutateAsync({ agentId: data.agents[0].id, message: prompt });

    console.log("response is", response);
    setIsSubmitting(false);
    // toast({
    //   title: "Profile Created!",
    //   description: "Your investment profile has been saved. We'll now analyze the best positions for you.",
    //   duration: 5000,
    // });

    toast.info("Your investment is successfully created!");
    // Reset form
    setCurrentStep(0);
    setFormData({
      riskTolerance: "",
      investmentBudget: "",
      targetReturn: 20,
      timeline: "",
      defiExperience: "",
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <RadioGroup
            value={formData.riskTolerance}
            onValueChange={(value) => setFormData({ ...formData, riskTolerance: value })}
            className="grid gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="conservative" id="conservative" />
              <Label htmlFor="conservative">Conservative - Prioritize capital preservation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label htmlFor="moderate">Moderate - Balance growth and safety</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aggressive" id="aggressive" />
              <Label htmlFor="aggressive">Aggressive - Maximize potential returns</Label>
            </div>
          </RadioGroup>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="budget">Investment Amount (EGLD)</Label>
              <Input
                id="budget"
                placeholder="Enter amount"
                value={formData.investmentBudget}
                onChange={(e) => setFormData({ ...formData, investmentBudget: e.target.value })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Target Annual Return: {formData.targetReturn}%</Label>
              <Slider
                value={[formData.targetReturn]}
                onValueChange={(value) => setFormData({ ...formData, targetReturn: value[0] })}
                max={100}
                step={1}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your investment timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short Term (&lt; 1 year)</SelectItem>
              <SelectItem value="medium">Medium Term (1-3 years)</SelectItem>
              <SelectItem value="long">Long Term (3+ years)</SelectItem>
            </SelectContent>
          </Select>
        );
      case 4:
        return (
          <RadioGroup
            value={formData.defiExperience}
            onValueChange={(value) => setFormData({ ...formData, defiExperience: value })}
            className="grid gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner">Beginner - New to DeFi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate - Some DeFi experience</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced">Advanced - Experienced DeFi user</Label>
            </div>
          </RadioGroup>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Risk Tolerance:</span>
                <span className="text-sm capitalize">{formData.riskTolerance}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Investment Budget:</span>
                <span className="text-sm">${formData.investmentBudget}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Target Return:</span>
                <span className="text-sm">{formData.targetReturn}% annually</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Timeline:</span>
                <span className="text-sm capitalize">{formData.timeline}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">DeFi Experience:</span>
                <span className="text-sm capitalize">{formData.defiExperience}</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{formSteps[currentStep].title}</CardTitle>
          <CardDescription>{formSteps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent(currentStep)}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isSubmitting}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep < formSteps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Invest
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      <ToastContainer />
    </>
  );
}
