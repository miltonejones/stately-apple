
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { Auth } from 'aws-amplify';

// add machine code
const tubeMachine = createMachine({
  id: "youtube_search",
  description:
    "The YouTube search machine connects to YouTube to perform simple searches. The results are returned as JSON and emitted to any calling component. The machine can also persist tracks for later reuse.",
    initial: "identify",
  context: {
    track: {},
    playlists: []
  },
  states: {


    identify: {
      entry: "initPins",
      description: "Get current user credentials from auth object",
      invoke: {
        src: "identifyUser",
        onDone: [
          {
            target: "idle",
            actions: "assignUser",
          },
        ],
        onError: [
          {
            target: "idle",  
          },
        ],
      },
    }, 

    idle: {
      description: "Machine waits for searches after updating context from storage",
      initial: "reload",
      states: {
        reload: {
          invoke: {
            src: "dynamoLoad",
            onDone: [
              {
                target: "collate",
                actions: "applyPins",
              },
            ],
          },
        },
        collate: {
          entry: "initPins",
        },
      },
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
        BATCH: {
          target: "batch_lookup",
          actions: "assignBatch",
          description: "Assign batch list to context",
        },
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
    
    batch_lookup: {
      description: "Look up a series of tracks on youtube.",
      invoke: {
        src: "initBatch",
      },
      initial: "next",
      states: {

        
        next: {
          description: "Find next item in the list and save it to storage.",
          initial: "verify",
          states: {
            verify: {
              description: "Check to see if this file has already been pinned",
              always: [
                {
                  target: "exec",
                  cond: "isntPinned",
                  description:
                    "Only look up if item is not already pinned, otherwise skip and move to next",
                },
                {
                  target: "#youtube_search.batch_lookup.find_next",
                  actions: "incrementBatch",
                  description: "Skip this item and move to next state",
                },
              ],
            },
            exec: {
              description: "Execute the search against the API for this item",
              invoke: {
                src: "execSearch",
                onDone: [
                  {
                    target: "#youtube_search.batch_lookup.find_next",
                    actions: ["persistResponse", "initPins"],
                    description: "Save response to storage",
                  },
                ],
              },
            },
          },
        },


        find_next: {
          description: "Move to next item in the list if there are more items in the batch",
          always: [
            {
              target: "next",
              cond: "moreBatch",
              description: "Find next item in list when there are more to find",
            },
            {
              target: "#youtube_search.idle",
              actions: "clearBatch",
              description: "No more items to find",
            },
          ],
        },
      },
    },

    
    dynamo: {
      description: "Persist changes to dynamo storage before reloading",
      invoke: {
        src: "dynamoPersist",
        onDone: [
          {
            target: "idle",
          },
        ],
      },
    },


  },
  on: {
    PIN: {
      target: ".dynamo",
      actions: "assignPin",
      description: "Add or remove a track from storage",
    },
    UPDATE: {
      target: ".dynamo",
      actions: "assignPinChange",
      description: "Change a property on the current pin",
    },
    CLEAR: {
      actions: "clearResponses",
      description: "Remove response from memory",
    },
    CHANGE: {
      actions: "applyChanges",
      description: "Change any property values of the machine context.",
    },
    NEXT: [
      {
        target: ".emit",
        cond: "canProceed",
        actions: "assignNext",
        description: "Play next or previous track in a track list",
      },
      {
        target: ".idle",
        description: "If no more items in the batch, clear and return to idle.",
        actions: "clearBatch"
      },
    ],
    GOTO: {
      target: ".emit",
      actions: "assignByIndex",
      description: "Open a specific index in the items list",
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    canProceed: context => {
      if (!context.items) return false;
      const selectedItem = !context.response?.pages
        ? {}
        : context.response.pages[0];
      const selectedIndex = context.items?.map(item => item.tubekey).indexOf (selectedItem?.href); 
      return selectedIndex < (context.items.length - 1);
    },
    isntPinned: (context) => {
      return !context.pins.some(f => f.param === context.param)
    },
    isUnpinned: (context, event) => {
      return !context.pins.some(f => f.param === event.param)
    },
    moreBatch: context => context.batch_index < context.batch.length
  },
  actions: {
    
    assignPinChange: assign((context, event) => {
     
      const pins = context.pins.map(f => f.param === event.pin.param 
          ? event.pin  
          : f )

      localStorage.setItem('tb-pins', JSON.stringify(pins)); 
  
      return {
        pins,
        items: context.items.map(item => item.tubekey === event.pin.tubekey 
            ? event.pin 
            : item)
      }
    
    }),
    applyChanges: assign((_, event) => ({
      [event.key]: event.value
    })),
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
      
      return {
        pins,
        items: [event.pin],
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
        items: event.items,
        response,
      }
       
    }),
    initPins: assign((context, event) => {
      const pins = context.pins || JSON.parse(localStorage.getItem('tb-pins') || '[]');

      const groupNames = {
        artistName: 'Artists',
        collectionName: 'Albums',
        primaryGenreName: 'Genres',
      };

      const playlists = pins.reduce((out, pin) => {
        if (!pin.playlists) return out;

        pin.playlists.map(name => {

          if (!out[name]) {
            Object.assign(out, {
              [name]: [],
            });
          }
          return out[name].push(pin);

        })
  
        return out;
      }, {});


    
      const groups = Object.keys(groupNames).reduce((collated, name) => {
        const group = pins.reduce((out, pin) => {
          if (!out[pin[name]]) {
            Object.assign(out, {
              [pin[name]]: [],
            });
          }
          out[pin[name]].push(pin);
          return out;
        }, {});
    
        Object.assign(collated, {
          [groupNames[name]]: group,
        });
        return collated;
      }, {});
    
      return {
        pins,
        groups,
        playlists
      };


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
      items: event.items,
      track: event.track
    })),

    incrementBatch: assign(context => {
      const batch_index = context.batch_index + 1;
      const next_item = context.batch[batch_index];
      const batch_progress = Math.floor(100 * (batch_index / context.batch.length))

      return { 
        batch_index,
        batch_progress,
        param: next_item?.param
      }

    }),


    persistResponse: assign((context, event) => {
      const old = context.batch[context.batch_index]
      const response = event.data;
      const first = response.pages[0];
      const batch_index = context.batch_index + 1;
      const batch_progress = Math.floor(100 * (batch_index / context.batch.length))

      // alert (JSON.stringify(first))

    
      if (!first) {
        return {
          batch_index ,
          batch_progress
        };
      }

      const pin = {
        ...old,
        title: first.page,
        tubekey: first.href
      }

      // alert (JSON.stringify(pin))

      const pins = context.pins.some(f => f.param === pin.param)
        ? context.pins.filter(f => f.param !== pin.param)
        : context.pins.concat(pin);
 


      localStorage.setItem('tb-pins', JSON.stringify(pins)); 
      const next_item = context.batch[batch_index];

      return {
        pins,
        batch_index,
        batch_progress,
        param: next_item?.param
      }


    }),

    
    assignByIndex: assign((context, event) => {
    
 
      const track = context.items[event.index];

      const response = {
        pages: [
          {
            page: track.title,
            href: track.tubekey,
            pinned: 1
          }
        ]
      }

 
      return {
        param: track?.param,
        track ,
        response
      }
        
    }),

    assignNext: assign((context, event) => {
      const selectedItem = !context.response?.pages
        ? {}
        : context.response.pages[0];
      const selectedIndex = context.items?.map(item => item.tubekey).indexOf (selectedItem?.href);
 
      const track = context.items[selectedIndex + 1];

      const response = {
        pages: [
          {
            page: track.title,
            href: track.tubekey,
            pinned: 1
          }
        ]
      }

 
      return {
        param: track?.param,
        track ,
        response
      }
        
    }),

    
    clearBatch: assign(({
      batch: null,
      param: null,
      items: null,
      batch_progress: 0
    })),
    assignUser: assign((_, event) => ({
      user: event.data, 
    })),
    assignBatch: assign((_, event) => ({
      batch: event.batch,
      param: event.batch[0].param,
      batch_index: 0
    })),
    applyPins: assign((_, event) => {
      // alert (1);
      console.log ({
        pins: event.data
      });
      return {
        pins: event.data
      }
    }),
    initBatch: assign({
      batch_index: 0
    })
  }
});
export const useTube = (onChange) => {
  const [state, send] = useMachine(tubeMachine, {
    services: {


      identifyUser: async() => {  
        return await Auth.currentAuthenticatedUser(); 
      }, 

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
      dynamoPersist: async(context) => {
        if (!context.user) return;
        const { userDataKey } = context.user;
        const ok = await setItem(userDataKey, 'library', context.pins);

      },
      dynamoLoad: async(context) => {
        if (!context.user) return [];
        const { userDataKey } = context.user;
        const ok = await getItem(userDataKey, 'library');
        return ok;
      },
      execSearch: async (context) => {
        return await searchTube(context.param)
      },
     },
  }); 

  const contains = track => {
    // console.log (
    //   state.context.pins,
    //   track
    // )
    return state.context.pins?.some(f => f.trackId === track.trackId);
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

const DYNAMO_ENDPOINT = "https://storage.puppeteerstudio.com";


const setItem = async (auth_key, data_key, data_value) => {
  // build request options
const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ auth_key, data_key, data_value  }),
};

// send POST request
const response = await fetch(DYNAMO_ENDPOINT, requestOptions);
return await response.json();
}

const getItem = async (auth_key, data_key) => {
  const response = await fetch(DYNAMO_ENDPOINT + `/${auth_key}/${data_key}`);
  return await response.json();
}

