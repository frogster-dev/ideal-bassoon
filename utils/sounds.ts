import { useAudioPlayer } from "expo-audio";

// Sound files - use relative paths for require() with assets
const startSessionSound = require("../assets/sounds/start-session.mp3");
const endSessionSound = require("../assets/sounds/end-session.mp3");
const startRestSound = require("../assets/sounds/start-rest.mp3");
const endRestSound = require("../assets/sounds/end-rest.mp3");

export const useSounds = () => {
  const startSessionPlayer = useAudioPlayer(startSessionSound);
  const endSessionPlayer = useAudioPlayer(endSessionSound);
  const startRestPlayer = useAudioPlayer(startRestSound);
  const endRestPlayer = useAudioPlayer(endRestSound);

  const playStartSession = () => {
    startSessionPlayer.seekTo(0);
    startSessionPlayer.play();
  };

  const playEndSession = () => {
    endSessionPlayer.seekTo(0);
    endSessionPlayer.play();
  };

  const playStartRest = () => {
    startRestPlayer.seekTo(0);
    startRestPlayer.play();
  };

  const playEndRest = () => {
    // Must start 2 seconds before to be right in time
    endRestPlayer.seekTo(0);
    endRestPlayer.play();
  };

  return {
    playStartSession,
    playEndSession,
    playStartRest,
    playEndRest,
  };
};
