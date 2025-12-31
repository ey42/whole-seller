"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmailTemplate from './EmailTemplate';

const MultiStepForm = () => {
  const [step, setStep] = useState(0);
  const totalSteps = 5;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));
  console.log(step);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-4">
      
      {/* 1. Progress Indicator (The Dots) */}
      <EmailTemplate firstName='eyueal' type='Password Reset' url='my name is url'/>
    
    </div>
  );
};

export default MultiStepForm;