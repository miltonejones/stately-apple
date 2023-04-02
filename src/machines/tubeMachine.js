
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

// add machine code
const tubeMachine = createMachine({
  id: "youtube_search",
  description:
    "The YouTube search machine connects to YouTube to perform simple searches. The results are returned as JSON and emitted to any calling component. The machine can also persist tracks for later reuse.",
  initial: "idle",
  context: {
    track: {}
  },
  states: {
    idle: {
      description: "Machine waits for searches",
      entry: "initPins",
      on: {
        FIND: [
          {
            target: "lookup",
            cond: "isUnpinned",
            actions: "assignParam",
            description: "Assign search param to context",
          },
          {
            target: "emit",
            actions: "assignPersistedResponse",
          },
        ],
      },
    },
    lookup: {
      description: "Perform YouTube search if item is not already pinned",
      invoke: {
        src: "execSearch",
        onDone: [
          {
            target: "emit",
            actions: "assignResponse",
            description: "Assign response data to context",
          },
        ],
        onError: [
          {
            target: "idle",
            description: "Fail silently on error.",
          },
        ],
      },
    },
    emit: {
      description: "Emit search responses to caller.",
      invoke: {
        src: "emitResponse",
        onDone: [
          {
            target: "idle",
            description: "Return to idle mode after search",
          },
        ],
      },
    },
  },
  on: {
    PIN: {
      actions: "assignPin",
      description: "Add or remove a track from storage",
    },
    CLEAR: {
      actions: "clearResponses",
      description: "Remove response from memory",
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    isUnpinned: (context, event) => {
      return !context.pins.some(f => f.param === event.param)
    }
  },
  actions: {
    clearResponses: assign((_, event) => ({
      response: null,
      track: {}
    })),
    assignPin: assign((context, event) => {
      const { response } = context;
      const pins = context.pins.some(f => f.param === event.pin.param)
        ? context.pins.filter(f => f.param !== event.pin.param)
        : context.pins.concat(event.pin);
        localStorage.setItem('tb-pins', JSON.stringify(pins));

      // const found = response.pages.some(page => page.href === event.pin.tubekey);
      // alert(found.toString())

      
      return {
        pins,
        response: {
          ...response,
          pages: response.pages.map(page => page.href === event.pin.tubekey
              ? ({
                ...page,
              pinned: 1
            })
              : page )
        }
      }
    }),
    assignPersistedResponse: assign((context, event) => {
      const { param  } = event;
      const { pins } = context;
      const pin = context.pins.find(f => f.param === event.param)
      const response = {
        pages: [
          {
            page: pin.title,
            href: pin.tubekey,
            pinned: 1
          }
        ]
      }

      return {

        param: event.param,
        track: event.track,
        response,
      }
       
    }),
    initPins: assign((_, event) => {
      const pins = JSON.parse(localStorage.getItem('tb-pins') || "[]");

      const groupNames = {
        artistName: 'Artists',
        collectionName: 'Albums',
        primaryGenreName: 'Genres'
      }

      const groups = Object.keys(groupNames).reduce((collated, name) => {

        const group = pins.reduce((out, pin) => {
          if (!out[pin[name]]) {
            Object.assign(out, ({
              [pin[name]]: []
            }))
          }
          out[pin[name]].push(pin); 
          return out;
        }, {});

        Object.assign(collated, {
          [groupNames[name]]: group
        })
        return collated;


      }, {})



 
      return {
        pins,
        groups
      }
    }),
    assignResponse: assign((_, event) => {
      const response = event.data;
      const first = response.pages[0];
      const regex = /v=(.*)/.exec(first.href);
      return {
        response,
        videoId: regex[0]
      }
    }),
    assignParam: assign((_, event) => ({
      param: event.param,
      track: event.track
    }))
  }
});
export const useTube = (onChange) => {
  const [state, send] = useMachine(tubeMachine, {
    services: {
      initYT: async (context) => {

        let player;
        window.onYouTubeIframeAPIReady = () => {
          player = new window.YT.Player('player', {
            videoId: context.videoId,
            events: {
              'onStateChange': onPlayerStateChange
            }
          });
        };
        // This function is called when the player's state changes.
        function onPlayerStateChange(event) {
          if (event.data === window.YT.PlayerState.ENDED) {
            // The video has finished playing.
            alert('Video finished!');
          }
        }

        onChange && onChange(context.response);
        return player;
      },
      emitResponse: async (context) => {
        onChange && onChange(context.response);
      },
      execSearch: async (context) => {
        return await searchTube(context.param)
      },
     },
  }); 

  const contains = track => {
    console.log (
      state.context.pins,
      track
    )
    return state.context.pins?.some(f => f.previewUrl === track.previewUrl);
  }

  const diagnosticProps = {
    ...tubeMachine,
    state,
    send,
  };

  return {
    state,
    send, 
    contains,
    diagnosticProps,
    ...state.context
  };
}

const API_ENDPOINT = "https://pv37bpjkgl.execute-api.us-east-1.amazonaws.com/find";
const searchTube = async (param) => {
  const response = await fetch(API_ENDPOINT + `/${encodeURIComponent(param)}`);
  return await response.json();
};


