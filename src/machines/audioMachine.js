
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import moment from "moment";
import { AudioConnector, frameLooper } from "./eq";
import { shuffle } from "../util/shuffle";

// add machine code
const audioMachine = createMachine(
  {
    id: "audio_player",
    initial: "begin",
    context: {
      shuffle: false,
      repeat: true,
      image:
        "https://is5-ssl.mzstatic.com/image/thumb/Podcasts116/v4/e4/a3/c6/e4a3c61d-7195-9431-f6a9-cf192f9c803e/mza_4615863570753709983.jpg/100x100bb.jpg",
      title: "This is the selected podcast title",
      scrolling: false,
      eq: true,
      src: `https://pdst.fm/e/chrt.fm/track/479722/arttrk.com/p/CRMDA/claritaspod.com/measure/pscrb.fm/rss/p/stitcher.simplecastaudio.com/9aa1e238-cbed-4305-9808-c9228fc6dd4f/episodes/d2a175f2-db09-480b-992d-d54b71c4c972/audio/128/default.mp3?aid=rss_feed&awCollectionId=9aa1e238-cbed-4305-9808-c9228fc6dd4f&awEpisodeId=d2a175f2-db09-480b-992d-d54b71c4c972&feed=dxZsm5kX`,
    },
    states: {
      begin: {
        invoke: {
          src: "loadAudio",
          onDone: [
            {
              target: "idle.loaded",
              actions: "assignResultsToContext",
            },
          ],
        },
      },
      idle: {
        initial: "loaded",
        states: {
          loaded: {
            on: {
              OPEN: {
                target: "#audio_player.opened",
                actions: "assignSourceToContext",
              },
              QUEUE: {
                target: "#audio_player.opened",
                actions: "initQueue",
              },
              CHANGE: {
                target: "#audio_player.idle.loaded",
                actions: "assignSourceToContext",
              },
            },
          },
        },
      },

      ended: {
        invoke: {
          src: "audioEnded",
        },
      },

      replay: {
        invoke: {
          src: "clearAudio",
          onDone: [
            {
              target: "opened",
            },
          ],
        },
      },

      opened: {
        initial: "reset",

        on: {
          CLOSE: {
            target: "idle",
            actions: "clearPlayer",
          },
        },
        states: {
          reset: {
            invoke: {
              src: 'audioStarted',
              onDone: [
                { 
                  target: "start",
                  actions: assign({
                    retries: 1,
                  }),
                }
              ]
            } 
          },
          start: {
            invoke: {
              src: "startAudio",
              onDone: [
                {
                  target: "playing",
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: assign({
                    retries: (context, event) => context.retries + 1,
                  }),
                },
              ],
            },
          },
          error: {
            initial: "retry",
            states: {
              retry: {
                invoke: {
                  src: "loadAudio",
                  onDone: [
                    {
                      target: "#audio_player.opened.start",
                      actions: "assignResultsToContext",
                      cond: (context) => context.retries < 4,
                    },
                    {
                      target: "#audio_player.opened.error.fatal",
                    },
                  ],
                },
              },
              fatal: {
                on: {
                  RECOVER: {
                    target: "#audio_player.idle",
                  },
                },
              },
            },
          },
          playing: {
            on: {
              PAUSE: {
                target: "paused",
                actions: "pausePlayer",
              },
              COORDS: {
                target: "playing",
                actions: "assignCoordsToContext",
              },
              PROGRESS: {
                target: "playing",
                actions: "assignProgressToContext",
              },
              SEEK: {
                target: "playing",
                actions: "seekPlayer",
              },
              ERROR: {
                target: "error",
                actions: "turnEqOff",
              },
              OPEN: {
                target: "#audio_player.replay",
                actions: ["assignSourceToContext"],
              },
              MOVE: {
                target: "#audio_player.replay",
                actions: "assignMovedTrackToContext"
              },
              END:[ 
                { 
                  target: "#audio_player.replay",
                  actions: "assignNextTrackToContext",
                  cond: "moreTracks"
                },
                { 
                  target: "#audio_player.idle",
                  actions: "clearPlayer" 
                }
            
              ]
              ,
              QUEUE: {
                actions: "addToQueue",
              },
              TOGGLE: {
                actions: "toggleProp",
              }, 
              SOUND: {
                actions: "assignVolume",
              }, 
            },
          }, 
          paused: {
            on: {
              PAUSE: {
                target: "playing",
                actions: "playPlayer",
              },
              OPEN: {
                target: "#audio_player.replay",
                actions: ["assignSourceToContext"],
              },
              QUEUE: {
                actions: "addToQueue",
              },
              TOGGLE: {
                actions: assign((context, event) => ({
                  [event.key]: !context[event.key],
                })),
              }, 
            },
          },
        },
      },
    },
  },
  {
    guards: {
      moreRetries:  (context) => context.retries < 4,
      moreTracks: (context) => { 
        const index =
          context.trackList.map((f) => f.previewUrl).indexOf(context.src) ;
          return !!context.repeat && index < (context.trackList.length - 1);
      }
    },
    actions: { 
      toggleProp: assign((context, event) => ({
          [event.key]: !context[event.key],
        })),
      initQueue: assign((context, event) => { 
        const { track } = event ;
        persistTrack(track); 
        return {
          ...track, 
          trackList: [track],
          src: track.src,
          scrolling: track.Title?.length > 35,
        }; 
      }),
      
      addToQueue: assign((context, event) => { 
        const index = context.trackList
          .map(t => t.ID)
          .indexOf(context.ID) + 1; 
        const trackList = context.trackList
          .slice(0, index)
          .concat([{ ...event.track, inserted: !0 }])
          .concat(context.trackList.slice(index));

        return {
          trackList 
        };
      }),
      clearPlayer: assign((context, event) => {
        context.player.pause();
        return {
          src: null,
          progress: null,
          currentTime: 0,
          duration: 0,
          current_time_formatted: "0:00",
        };
      }),
      assignVolume: assign((context, event) => {
        context.player.volume = event.value;
        return {
          volume: event.value,
        }
      }),
      pausePlayer: assign((context, event) => {
        context.player.pause();
      }),
      playPlayer: assign((context, event) => {
        context.player.play();
      }),
      seekPlayer: assign((context, event) => {
        context.player.currentTime = event.value;
      }),
      assignProgressToContext: assign((context, event) => {
        const { currentTime, duration } = event;
        const current_time_formatted = !currentTime
          ? "0:00"
          : moment.utc(currentTime * 1000).format("mm:ss");

        const duration_formatted = !duration
          ? "0:00"
          : moment.utc(duration * 1000).format("mm:ss");
        return {
          currentTime,
          current_time_formatted,
          duration_formatted,
          duration,
          progress: (currentTime / duration) * 100,
        };
      }),
      assignCoordsToContext: assign((context, event) => {
        return {
          coords: event.coords,
        };
      }),
      turnEqOff: assign((context, event) => {
        context.player.pause();
        return {
          eq: false,
          player: null,
          retries: context.retries + 1,
        };
      }),
      turnEqOn: assign((context, event) => {
        context.player.pause();
        return {
          eq: true,
          player: null,
        };
      }),
      assignResultsToContext: assign((context, event) => {
        return {
          player: event.data,
          volume: event.data.volume,
          memory: getPersistedTracks()
        };
      }),
      assignMovedTrackToContext: assign((context, event) => {
        const index =
          context.trackList.map((f) => f.previewUrl).indexOf(context.src) + event.index;
        const track = context.trackList[index]; 
        persistTrack(track);
        return {
          ...track, 
          src: track.previewUrl,
          scrolling: track.Title?.length > 35,
        };
      }),
      assignNextTrackToContext: assign((context, event) => {
        const index =
          context.trackList.map((f) => f.previewUrl).indexOf(context.src) + 1;
        const items = !context.shuffle ? context.trackList : shuffle(context.trackList)
        const track = items[index];
        persistTrack(track);
        return {
          ...track, 
          src: track.previewUrl,
          scrolling: track.Title?.length > 35,
        };
      }),
      assignSourceToContext: assign((context, event) => {
        const { value, options, trackList, type, ...rest} = event;
        persistTrack(rest); 
        return {
          ...event, 
          trackList: event.trackList,
          src: event.src,
          scrolling: event.Title?.length > 35,
        };
      }),
    },
  }
);


const connector = new AudioConnector();
export const useAudio = (onPlayStart) => {
  const services = {
    clearAudio: async (context) => {
      context.player.pause();
      context.player.src = null;
      await new Promise((go) => setTimeout(go, 999));
    },

    startAudio: async (context) => {
      try { 
        context.player.src = context.src;
        context.player.play();
        return context.player;
      } catch (e) {
        throw new Error(e);
      }
    },
    audioStarted: async (context) =>
      onPlayStart && onPlayStart(context.src),
    loadAudio: async (context) => {
      const audio = new Audio();
      if (context.eq) {
        const { analyser } = connector.connect(audio);
        frameLooper(analyser, (coords) => {
          send({
            type: "COORDS",
            coords,
          });
        });
      }

      audio.addEventListener("ended", () => {
        send("END");
      });

      audio.addEventListener("error", () => {
        send("ERROR");
      });

      audio.addEventListener("timeupdate", () => {
        // const coords = frameLooper(analyser);
        // console.log ({ coords })
        send({
          type: "PROGRESS",
          currentTime: audio.currentTime,
          duration: audio.duration,
          // coords: frameLooper(analyser)
        });
      });
      return audio;
    },
  };

  
  const [state, send] = useMachine(audioMachine, {
    services
  }); 

  const { duration, currentTime, src } = state.context;

  // const idle = state.matches("idle");

  const handleSeek = (event, newValue) => {
    const percent = newValue / 100;
    send({
      type: "SEEK",
      value: duration * percent,
    });
  };

  const handleSkip = (secs) => {
    // alert(currentTime);
    // const percent = newValue / 100;
    send({
      type: "SEEK",
      value: currentTime + Number(secs),
    });
  };

  const handlePlay = (value, options) => {
    const replay = !!value && value !== src;
    if (state.matches("idle.loaded") || replay) {
      return send({
        type: "OPEN", 
        value,
        ...options,
      });
    }

    return send({
      type: "PAUSE",
    });
  };

  const handleEq = () => {
    send({
      type: "EQ",
    });
  };

  const handleClose = () => {
    send({
      type: "CLOSE",
    });
  };

  const handleList = () =>
    send({
      type: "TOGGLE",
      key: "listopen",
    });

  const handleDebug = () =>
    send({
      type: "TOGGLE",
      key: "debug",
    });

    const diagnosticProps = {
      ...audioMachine,
      state,
      send,
    };
  
  return {
    state,
    send, 
    handleDebug,
    handleClose,
    handleSeek,
    handleSkip,
    handlePlay,
    handleList,
    handleEq,
    diagnosticProps,
    ...state.context
  };
}


const COOKIE_NAME = 'track-memory-apple';
const persistTrack = track => {
  const memory = JSON.parse(localStorage.getItem(COOKIE_NAME) || "[]");
  const update = memory.find(f => f.ID === track.ID)
    ? memory 
    : memory.concat(track);
  localStorage.setItem(COOKIE_NAME, JSON.stringify(update));
}

const getPersistedTracks = () => JSON.parse(localStorage.getItem(COOKIE_NAME) || "[]")