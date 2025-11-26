import React from 'react'

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-12 h-12 -mt-20" style={{ animation: 'spin 1.5s linear infinite' }}>
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="absolute w-1.5 h-1.5 bg-black rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${index * 45}deg) translate(0, -16px)`,
              transformOrigin: '0 0',
              opacity: index === 0 ? 0 : 1
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default Loader