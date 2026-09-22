import React, { useState } from 'react';

interface TeacherAvatarProps {
  name: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Extracts the first meaningful letter from a person's name,
 * safely ignoring titles such as (م. / مهندس / مهندسة / د. / دكتور / دكتورة / أ. / أستاذ / أستاذة / أخصائي).
 */
export function getTeacherInitial(name: string): string {
  if (!name || !name.trim()) return 'م';
  const cleaned = name
    .trim()
    .replace(
      /^(م\.|د\.|أ\.|مهندس\s+|مهندسة\s+|دكتور\s+|دكتورة\s+|أستاذ\s+|أستاذة\s+|أخصائي\s+|أخصائية\s+|م\s*\/\s*|د\s*\/\s*|أ\s*\/\s*)/i,
      ''
    )
    .trim();
  const target = cleaned || name.trim();
  return target.charAt(0) || 'م';
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-13 h-13 text-base',
  xl: 'w-16 h-16 text-xl'
};

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  name,
  avatar,
  size = 'md',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  // Check if avatar is a valid custom image and not the legacy hardcoded male unsplash photo
  const isValidCustomAvatar =
    avatar &&
    avatar.trim() !== '' &&
    !avatar.includes('photo-1472099645785-5658abf4ff4e') &&
    !imgError;

  const initial = getTeacherInitial(name);
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (isValidCustomAvatar) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
        className={`${sizeClass} rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0 ${className}`}
      />
    );
  }

  // Stylish letter-based avatar in WE brand purple gradient
  return (
    <div
      className={`${sizeClass} rounded-2xl bg-gradient-to-br from-[#4A154B] to-[#2E0831] text-white font-black flex items-center justify-center shadow-xs border border-purple-900/30 select-none shrink-0 ${className}`}
      title={name}
      aria-label={name}
    >
      <span>{initial}</span>
    </div>
  );
};
