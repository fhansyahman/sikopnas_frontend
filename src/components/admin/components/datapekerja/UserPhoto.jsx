"use client";

import { useState } from "react";
import { User } from "lucide-react";

export function UserPhoto({ user, size = 'sm' }) {
  const [imgError, setImgError] = useState(false);
  
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };
  
  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48
  };

  const photoUrl = getPhotoUrl(user?.foto);
  
  if (!photoUrl || imgError) {
    return (
      <div className={`${sizes[size]} rounded-full border-2 border-gray-100 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow`}>
        <User size={iconSizes[size]} className="text-gray-600" />
      </div>
    );
  }
  
  return (
    <div className={`${sizes[size]} rounded-full border-2 border-gray-100 overflow-hidden shadow relative`}>
      <img
        src={photoUrl}
        alt={user.nama}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
        user.is_active ? 'bg-green-500' : 'bg-gray-400'
      }`}></div>
    </div>
  );
}

function getPhotoUrl(photoPath) {
  if (!photoPath || photoPath.trim() === '' || photoPath === 'null' || photoPath === 'undefined') {
    return null;
  }
  
  if (photoPath.startsWith('data:image')) {
    return photoPath;
  }
  
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  
  if (photoPath.startsWith('/uploads/')) {
    return photoPath;
  }
  
  const isImageFile = photoPath.includes('.png') || photoPath.includes('.jpg') || 
                      photoPath.includes('.jpeg') || photoPath.includes('.gif');
  
  if (isImageFile) {
    return `/uploads/users/${photoPath}`;
  }
  
  return null;
}