import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech } from './services/geminiService';
import { DEFAULT_SCRIPT, TTSState, CHARACTERS, Character } from './types';
import { AudioVisualizer } from './components/AudioVisualizer';

// Icons
const SparkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-cyan-400">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-6-6M12 12.75l6-6M12 12.75v-9" />
  </svg>
);

const ReloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

const App: React.FC = () => {
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [temperature, setTemperature] = useState<number>(1.0); // 0.0 to 2.0 (API Limit)
  const [state, setState] = useState<TTSState>({
    isLoading: false,
    isPlaying: false,
    audioUrl: null,
    error: null,
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleCharacterSelect = (character: Character) => {
      setSelectedCharacter(character);
      // Reset audio state when character changes because the voice doesn't match anymore
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
      if (state.audioUrl) {
          URL.revokeObjectURL(state.audioUrl);
      }
      setState({
          isLoading: false,
          isPlaying: false,
          audioUrl: null,
          error: null
      });
  };

  const handleGenerate = async () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    
    setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null, 
        isPlaying: false, 
        audioUrl: null 
    }));

    try {
      const url = await generateSpeech(script, selectedCharacter.voiceName, temperature);
      setState(prev => ({ ...prev, isLoading: false, audioUrl: url }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err instanceof Error ? err.message : "Error desconocido al generar audio." 
      }));
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !state.audioUrl) return;

    if (state.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleAudioEnded = () => {
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const handlePlayStateChange = (isPlaying: boolean) => {
      setState(prev => ({ ...prev, isPlaying }));
  }

  useEffect(() => {
    if (state.audioUrl && audioRef.current) {
        audioRef.current.src = state.audioUrl;
        audioRef.current.load();
    }
  }, [state.audioUrl]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Script Editor (Span 4) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg border bg-opacity-10 ${selectedCharacter.color} bg-${selectedCharacter.color} border-${selectedCharacter.color}`}>
              <SparkIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">
                Guion de {selectedCharacter.name}
              </h1>
              <p className="text-xs text-slate-400">Edita el texto para generar la voz.</p>
            </div>
          </div>

          <div className="relative group flex-grow">
             <div className={`absolute -inset-0.5 bg-gradient-to-r ${selectedCharacter.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}></div>
            <div className="relative h-full">
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-96 lg:h-[40rem] bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 text-base leading-relaxed text-slate-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none shadow-xl transition-all"
                style={{ '--tw-ring-color': `var(--color-${selectedCharacter.color.replace('bg-', '')})` } as any}
                placeholder={`¿Qué quieres que diga ${selectedCharacter.name}?`}
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-slate-900/80 px-2 py-1 rounded">
                {script.length} caracteres
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Character Selection (Span 4) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
            <h2 className="text-lg font-semibold text-slate-300 px-2">Selecciona tu Personaje</h2>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[45rem] pr-2">
                {CHARACTERS.map((char) => (
                    <button
                        key={char.id}
                        onClick={() => handleCharacterSelect(char)}
                        className={`relative p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] flex flex-col items-start gap-2
                            ${selectedCharacter.id === char.id 
                                ? `bg-slate-800 border-t-2 border-b-0 border-l-0 border-r-0 border-t-${char.gradient.split('-')[1]} shadow-lg shadow-${char.gradient.split('-')[1]}/10`
                                : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800'
                            }
                        `}
                    >
                         {selectedCharacter.id === char.id && (
                             <div className={`absolute inset-0 bg-gradient-to-br ${char.gradient} opacity-5 rounded-xl pointer-events-none`}></div>
                         )}

                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${char.gradient} p-0.5`}>
                            <img 
                                src={`https://picsum.photos/seed/${char.avatarSeed}/100`} 
                                alt={char.name}
                                className="w-full h-full rounded-full object-cover border-2 border-slate-900 grayscale-[20%]"
                            />
                        </div>
                        <div>
                            <div className={`font-bold ${selectedCharacter.id === char.id ? 'text-white' : 'text-slate-300'}`}>{char.name}</div>
                            <div className={`text-xs ${char.textColor} opacity-90 font-medium`}>{char.role}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Right Column: Active Persona & Controls (Span 4) */}
        <div className="lg:col-span-4 flex flex-col justify-start pt-8">
          
          {/* Persona Card */}
          <div className="relative bg-slate-800/80 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-md shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-between">
             {/* Decorative Elements based on character color */}
            <div className={`absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br ${selectedCharacter.gradient} opacity-20 rounded-full blur-3xl transition-colors duration-700`}></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 flex-grow">
              <div className="relative">
                <div className={`w-40 h-40 rounded-full p-1.5 bg-gradient-to-tr ${selectedCharacter.gradient} ${state.isPlaying ? 'animate-spin-slow' : 'shadow-lg'} transition-all duration-700`}>
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-900 bg-slate-800">
                        <img 
                            src={`https://picsum.photos/seed/${selectedCharacter.avatarSeed}/400`} 
                            alt={`${selectedCharacter.name} Avatar`} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                 {state.isPlaying && (
                    <div className={`absolute -bottom-3 -right-3 bg-gradient-to-r ${selectedCharacter.gradient} text-xs font-bold px-3 py-1 rounded-full text-white shadow-lg animate-bounce`}>
                        HABLANDO
                    </div>
                )}
              </div>
              
              <div className="space-y-2 w-full">
                <h2 className="text-4xl font-bold text-white tracking-tight">{selectedCharacter.name}</h2>
                <p className={`text-lg font-medium ${selectedCharacter.textColor}`}>{selectedCharacter.role}</p>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-xs mx-auto">
                  {selectedCharacter.description}
                </p>
              </div>

              {/* Temperature Control */}
              <div className={`w-full max-w-xs bg-slate-900/40 rounded-xl p-3 border border-slate-700/30 ${selectedCharacter.textColor}`}>
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400 font-medium">Estabilidad</span>
                      <span className="text-xs font-bold">Expresividad ({temperature.toFixed(1)})</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                        accentColor: 'currentColor'
                    }}
                  />
                  <div className="flex justify-between mt-1 px-1">
                      {[0, 0.5, 1, 1.5, 2].map((tick) => (
                          <div key={tick} className="flex flex-col items-center gap-1 w-4">
                              <div className="w-0.5 h-1.5 bg-slate-600"></div>
                              <span className="text-[10px] text-slate-500 font-medium">{tick}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Visualizer */}
              <div className="w-full bg-slate-900/60 rounded-xl p-4 border border-slate-700/50 h-24 flex items-center justify-center mt-auto">
                 {state.audioUrl ? (
                     <AudioVisualizer isPlaying={state.isPlaying} />
                 ) : (
                     <span className="text-slate-600 text-sm italic">Esperando generación...</span>
                 )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 w-full justify-center pt-4">
                {state.audioUrl ? (
                    <>
                        <button
                            onClick={togglePlayback}
                            className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${selectedCharacter.gradient} text-white transition-all shadow-lg hover:scale-105 active:scale-95`}
                        >
                            {state.isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                        
                        <a 
                            href={state.audioUrl} 
                            download={`${selectedCharacter.name}-guion.wav`}
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all border border-slate-600"
                            title="Descargar Audio"
                        >
                            <DownloadIcon />
                        </a>
                         <button
                            onClick={handleGenerate}
                            disabled={state.isLoading}
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all border border-slate-600"
                            title="Regenerar"
                        >
                             <ReloadIcon />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleGenerate}
                        disabled={state.isLoading}
                        className={`
                            px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all w-full
                            ${state.isLoading 
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                : `bg-gradient-to-r ${selectedCharacter.gradient} text-white hover:scale-[1.02] active:scale-[0.98]`
                            }
                        `}
                    >
                        {state.isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generando Voz...
                            </span>
                        ) : (
                            `Voz de ${selectedCharacter.name}`
                        )}
                    </button>
                )}
              </div>
            </div>
          </div>
          
           {state.error && (
                <div className="mt-4 text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-lg border border-red-900/50 text-center">
                  {state.error}
                </div>
              )}
        </div>
      </div>

      {/* Hidden Audio Element for Logic */}
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded} 
        onPlay={() => handlePlayStateChange(true)}
        onPause={() => handlePlayStateChange(false)}
        className="hidden" 
      />
      
      <style>{`
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        input[type=range] {
           accent-color: currentColor; 
        }
      `}</style>
    </div>
  );
};

export default App;