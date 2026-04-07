"use client";
import React, { useState, useEffect } from 'react';
import { createConfig, http, WagmiProvider, useAccount, useConnect, useSendTransaction, useChainId, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { parseEther } from 'viem';
import { ShieldCheck, Zap } from 'lucide-react';
import sdk from "@farcaster/frame-sdk";

const queryClient = new QueryClient();
const config = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  connectors: [injected()],
});

const questions = [
  { q: "Since when have you used Base?", options: ["Before Onchain Summer", "Late 2024", "2025", "Just joined"], scores: [40, 25, 10, 5] },
  { q: "Total Transactions?", options: ["0-10", "10-50", "50-500", "500+"], scores: [5, 15, 30, 45] },
  { q: "Smart Contracts Deployed?", options: ["0", "1-5", "5-20", "I am Jesse Pollak"], scores: [0, 20, 45, 100] },
  { q: "Amount Bridged to Base?", options: ["<0.01 ETH", "0.1 ETH", "1 ETH", "Whaling"], scores: [5, 15, 30, 45] }
];

function QuizContent() {
  const [step, setStep] = useState('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { sendTransaction, isPending } = useSendTransaction();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    load();
  }, []);

  useEffect(() => {
    if (!isConnected && connectors[0]) connect({ connector: connectors[0] });
  }, [connectors, isConnected, connect]);

  const handleAnswer = (s) => {
    setScore(score + s);
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
    else setStep('result');
  };

  const handleClaim = () => {
    sendTransaction({
      to: '0xf534EEE04421D0dA4720f03054aAD12cb1686fc0',
      value: parseEther('0.00003'),
      chainId: base.id,
      data: '0x62635f706137686c6539340b0080218021802180218021802180218021',
    });
  };

  return (
    <div className="min-h-screen bg-[#0052FF] font-sans text-white p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white text-black rounded-[2rem] overflow-hidden shadow-2xl p-8">
        {step === 'intro' && (
          <div className="text-center">
            <ShieldCheck className="text-[#0052FF] w-16 h-16 mx-auto mb-6" />
            <h1 className="text-3xl font-black mb-4 text-[#0052FF]">Base Airdrop Checker</h1>
            <p className="text-gray-500 mb-8">Check if your activity qualifies for the next phase.</p>
            <button onClick={() => setStep('quiz')} className="w-full py-4 bg-[#0052FF] text-white rounded-2xl font-bold">Check Eligibility</button>
          </div>
        )}

        {step === 'quiz' && (
          <div>
            <h2 className="text-2xl font-extrabold mb-8">{questions[currentQ].q}</h2>
            <div className="space-y-3">
              {questions[currentQ].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(questions[currentQ].scores[i])} className="w-full text-left p-5 rounded-2xl border-2 hover:border-[#0052FF] font-semibold">{opt}</button>
              ))}
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="text-center">
            <div className="text-7xl font-black mb-6 italic text-[#0052FF]">{Math.min(score, 100)}%</div>
            <p className="text-sm text-gray-600 mb-8">Verify to finalize results (0.00003 ETH fee).</p>
            
            {chainId !== base.id ? (
              <button 
                onClick={() => switchChain({ chainId: base.id })} 
                className="w-full py-4 bg-[#0052FF] text-white rounded-2xl font-bold mb-6"
              >
                Switch to Base Network
              </button>
            ) : (
              <button 
                onClick={handleClaim} 
                disabled={isPending} 
                className="w-full py-4 bg-black text-white rounded-2xl font-bold mb-6 flex items-center justify-center gap-2"
              >
                {isPending ? "Confirming..." : <><Zap size={18} /> Claim & Verify</>}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <QuizContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}