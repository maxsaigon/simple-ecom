import React from 'react';
import { Loader } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Loader className="animate-spin h-8 w-8 text-primary" />
    </div>
  );
}