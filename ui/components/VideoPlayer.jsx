import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'

import useWindowSize from '../hooks/useWindowSize'

import dashjs from "dashjs";

const PLAYER_CONTROLS_WIDTH = 150
const PLAYER_CONTROLS_HEIGHT = 50
const CONTENT_SHADOW = '0px 0px 4px rgba(255, 255, 255, 0.5)'

const controlIconStyle = {
  fontSize: '20px',
  filter: `drop-shadow(${CONTENT_SHADOW})`,
}

const VideoPlayer = ({ url }) => {
     const videoRef = useRef(null);

    useEffect(() => {
        let player;
        if (videoRef.current) {
            // Initialize dash.js player
            player = dashjs.MediaPlayer().create();
            player.initialize(videoRef.current, url, true);
        }

        return () => {
            // Clean up the player on component unmount
            if (player) {
                player.reset();
            }
        };
    }, [url]);

    return (
        <video ref={videoRef} controls style={{ width: '100%' }}>
            Your browser does not support HTML5 video.
        </video>
    );
};

export default VideoPlayer
