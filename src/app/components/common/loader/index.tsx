import React from 'react'

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-12 h-12">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-black rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${index * 45}deg) translate(0, -18px)`,
              transformOrigin: '0 0',
              animation: `fade 1s linear infinite`,
              animationDelay: `${index * 0.125}s`,
              opacity: 0.2
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes fade {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default Loader