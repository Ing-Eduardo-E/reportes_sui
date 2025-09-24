import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg', 
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo usando la imagen real */}
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <Image
          src="/img/Logotipo.png"
          alt="3E Asesorías y Consultorías Logo"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'contain' }}
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <div className={`font-bold text-blue-600 ${textSizeClasses[size]}`}>
            3E
          </div>
          {size !== 'sm' && (
            <div className={`text-gray-600 ${size === 'xl' ? 'text-base' : 'text-xs'} leading-tight`}>
              Asesorías y Consultorías
            </div>
          )}
        </div>
      )}
    </div>
  );
}