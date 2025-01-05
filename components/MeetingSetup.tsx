'use client'
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import StartRecordingEarly from './StartRecordingEarly';

const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void }) => {
  const call = useCall();
  if (!call) {
    throw new Error('useStreamCall must be used within a StreamCall component.');
  }

  const [isMicCamToggleledOn, setIsMicCamToggledOn] = useState(false);

  useEffect(() => {
    if (isMicCamToggleledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggleledOn, call?.camera, call?.microphone]);
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
      <h1 className='text-2xl font-bold'>Setup</h1>
      <VideoPreview />
      <div className='flex h-16 items-center justify-center gap-3'>
        <label className='flex items-center justify-center gap-2 font-medium'>
          <input
            type='checkbox'
            checked={isMicCamToggleledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className='rounded-md bg-green-500 px-4 py-2.5 border-2'
        onClick={async () => {
          try {
            // Join the call
            await call.join();

            // Automatically start the recording (but keep it hidden)
            await call.startRecording();
            // Mark setup as complete
            setIsSetupComplete(true);
          } catch (error) {
            console.error('Error joining or starting recording:', error);
          }
        }}
      >
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
