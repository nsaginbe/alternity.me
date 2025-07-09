import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { CelebrityImageMultiSource } from './CelebrityImage';

interface CelebrityMatchCardProps {
  celebrityName: string;
  similarity: number;
  userImage: string;
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
  currentMatchIndex: number;
  totalMatches: number;
}

export const CelebrityMatchCard: React.FC<CelebrityMatchCardProps> = ({
  celebrityName,
  similarity,
  userImage,
  onNext,
  onPrev,
  isNextDisabled,
  isPrevDisabled,
  currentMatchIndex,
  totalMatches,
}) => {
  return (
    <Card className="w-full bg-white shadow-xl rounded-2xl">
      <CardContent className="p-8">
        <div className="flex justify-center items-end gap-12">
          
          {/* User's Photo */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-gray-800">Your Photo</h3>
            <div className="w-96 h-96 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100">
              <img src={userImage} alt="Your Photo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Vertical Match Bar */}
          <div className="flex flex-col items-center gap-3 pb-4">
            <div className="relative w-3 h-80 bg-gray-200 rounded-full">
              <div
                className="absolute bottom-0 w-3 bg-green-500 rounded-full"
                style={{ height: `${similarity * 100}%` }}
              ></div>
            </div>
            <p className="text-lg font-semibold text-gray-700">{Math.round(similarity * 100)}%</p>
          </div>

          {/* Celebrity's Photo */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-gray-800">{celebrityName}</h3>
            <CelebrityImageMultiSource name={celebrityName} similarity={similarity} index={currentMatchIndex} size={96} className="!m-0" />
          </div>

        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <Button onClick={onPrev} disabled={isPrevDisabled} variant="outline" size="lg">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <Button onClick={onNext} disabled={isNextDisabled} variant="outline" size="lg">
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 