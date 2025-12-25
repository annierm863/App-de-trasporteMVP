
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decodeBase64, encodeBase64, decodeAudioData } from '../services/geminiService';

interface VoiceConciergeProps {
  onClose: () => void;
}

const VoiceConcierge: React.FC<VoiceConciergeProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [transcript, setTranscript] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: 'You are an elite luxury travel concierge for LuxeRide. You help clients book chauffeurs, provide flight information, and recommend high-end establishments. Your tone is professional, sophisticated, and warm.',
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
          callbacks: {
            onopen: () => {
              setStatus('Listening...');
              setIsActive(true);
              
              const source = audioContextRef.current!.createMediaStreamSource(stream);
              const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const base64 = encodeBase64(new Uint8Array(int16.buffer));
                
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(audioContextRef.current!.destination);
            },
            onmessage: async (message) => {
              if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                const base64 = message.serverContent.modelTurn.parts[0].inlineData.data;
                const audioBuffer = await decodeAudioData(
                  decodeBase64(base64),
                  outputAudioContextRef.current!,
                  24000,
                  1
                );
                
                const source = outputAudioContextRef.current!.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContextRef.current!.destination);
                
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current!.currentTime);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
                
                source.onended = () => sourcesRef.current.delete(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }

              if (message.serverContent?.outputTranscription) {
                setTranscript(prev => prev + message.serverContent!.outputTranscription!.text);
              }
              if (message.serverContent?.turnComplete) {
                setTranscript('');
              }
            },
            onerror: (err) => console.error("Live Error:", err),
            onclose: () => setStatus('Connection closed'),
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (error) {
        console.error("Initialization Error:", error);
        setStatus('Error: Permission Denied');
      }
    };

    startSession();

    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
      <div className="w-full max-w-md flex flex-col items-center gap-12 text-center">
        <div className="relative">
          <div className={`absolute -inset-8 rounded-full bg-primary/20 blur-3xl transition-all duration-1000 ${isActive ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`}></div>
          <div className={`relative flex size-32 items-center justify-center rounded-full border-2 transition-all duration-500 ${isActive ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'}`}>
            <span className={`material-symbols-outlined text-5xl transition-all duration-500 ${isActive ? 'text-primary scale-110' : 'text-white/20'}`}>
              {isActive ? 'mic' : 'mic_off'}
            </span>
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`absolute size-full rounded-full border border-primary/40 animate-ping`} style={{ animationDelay: `${i * 0.4}s` }}></div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight text-white">{status}</h3>
          <p className="text-primary/60 text-sm font-medium uppercase tracking-[0.2em]">LuxeRide Concierge</p>
        </div>

        <div className="min-h-[60px] max-w-xs">
          <p className="text-white/70 text-lg italic font-light animate-pulse">
            {transcript || '"I need a chauffeur for JFK Airport..."'}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 size-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 transition-all hover:scale-110"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
      </div>
    </div>
  );
};

export default VoiceConcierge;
