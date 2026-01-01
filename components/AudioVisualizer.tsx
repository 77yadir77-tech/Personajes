import React from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  return (
    <div className="flex items-center justify-center space-x-1 h-12 w-full">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full bg-cyan-400 transition-all duration-300 ease-in-out ${
            isPlaying ? 'animate-pulse' : 'h-1 opacity-30'
          }`}
          style={{
            height: isPlaying ? `${Math.random() * 100}%` : '4px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
};