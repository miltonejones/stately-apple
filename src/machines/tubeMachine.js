import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { Auth, Storage } from "aws-amplify";
// import { objectGet, objectPut } from "../util/objectPut"; 


// add machine code
const tubeMachine = createMachine(
  {
    id: "youtube_search",
    description:
      "The YouTube search machine connects to YouTube to perform simple searches. The results are returned as JSON and emitted to any calling component. The machine can also persist tracks for later reuse in localStorage or, when the user is logged in, in a server-side DynamoDB.",
    initial: "idle",
    context: {
      track: {},
      playlists: [],
      response_index: 0,
      pins: [],
      view: 'list'
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
        description:
          "Machine waits for searches after updating context from storage",
        entry: "setContextMessage",
        initial: "reload",
        meta: {
          message: "Ready",
        },
        states: {
          reload: {
            invoke: {
              src: "dynamoLoad",
              onDone: [
                {
                  target: "collate",
                  actions: "applyPins",
                  description: "Assign downloaded tracks to context.",
                },
              ],
            },
          },
          collate: { 
            description: "Organize flat list into categories for the UI",
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
          BATCH: [
            {
              target: "batch_lookup",
              cond: "isLoggedIn",
              actions: "assignBatch",
              description: "Assign batch list to context",
            },
            {
              target: "no_access",
              description: "Move to no-access state",
            },
          ],
        },
      },

    lookup: {
      description: "Perform YouTube search if item is not already pinned",
      entry: [assign({batch: []}), "setContextMessage"],
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
      on: {
        FIND: {
          actions: "appendTrack",
          description:
            "when FIND is called while lookup is in progress, append the track to the batch.",
        },
        BATCH: {
          actions: "appendBatch",
          description:
            "when BATCH is called while lookup is in progress, append the tracks to the batch.",
        },
      },
    },

 
      emit: {
        description: "Emit search responses to calling component and return to idle state.",
        invoke: {
          src: "emitResponse",
          onDone: [
            {
              target: "idle",
              cond: "emptyBatch",
              description: "Return to idle mode after search",
            },
            {
              target: "batch_lookup",
              description: "If there is a batch pending, move to batch_lookup",
            },
          ],
        },
      },

      batch_lookup: {
        description: "Look up a series of tracks on youtube.",
        entry: "initBatch",
        initial: "next",
        states: {
          next: {
            description: "Find next item in the list and save it to storage.",
            initial: "verify",
            states: {
              verify: {
                description:
                  "Check to see if this file has already been pinned",
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
                entry: "setContextMessage",
                invoke: {
                  src: "execSearch",
                  onDone: [
                    {
                      target: "#youtube_search.batch_lookup.find_next",
                      actions: ["persistResponse", "initPins"],
                      description: "Save response to storage",
                    },
                  ],
                  onError: [
                    {
                      target: "#youtube_search.batch_lookup.find_next",
                      description: "fail silently",
                      actions: "incrementBatch",
                    },
                  ],
                },
              },
            },
          },

          find_next: {
            description:
              "Move to next item in the list if there are more items in the batch",
            entry: "setContextMessage",
            invoke: {
              src: "dynamoPersist",
              onDone: [
                {
                  target: "next",
                  cond: "moreBatch",
                  description:
                    "Find next item in list when there are more to find",
                },
                {
                  target: "#youtube_search.idle",
                  actions: "clearBatch",
                },
              ],
            },
          },
        },
        on: {
          NEXT: {
            target: "play",
            cond: "canProceed",
            actions: "assignNext",
            description: 'Play next or previous track in a track list"',
          },
          CANCEL: {
            target: "idle",
            actions: "clearBatch",
            description: "User cancels batch before completion",
          },
          GOTO: {
            target: "play",
            actions: "assignByIndex",
            description: "Open a specific index in the items list",
          },
          FIND: [
            {
              cond: "isUnpinned",
              actions: "appendTrack",
              description:
                "when FIND is called while batch is in progress, append the track to the batch.",
            },
            {
              target: "play",
              actions: ["assignParam", "assignPersistedResponse"],
            },
          ],
          BATCH: {
            actions: "appendBatch",
            description:
              "when BATCH is called while batch is in progress, append the tracks to the batch.",
          },
        },
      },

      signout: {
        description: "Sign out and remove user",
        invoke: {
          src: "userSignOut",
          onDone: [
            {
              target: "idle",
              actions: "removeUser",
              description: "Remove user from context",
            },
          ],
        },
      },


  
      no_access: {
        description: "User is stuck here unless they cancel or log in",
        on: {
          OK: {
            target: "idle",
            description: "User leaves without logging in",
          },
        },  
      },
  
  
      dynamo: {
        description: "Persist changes to dynamo storage before reloading",
        initial: "check_login",
        states: {
          check_login: {
            description: "Make sure the user is logged in before attempting to save.",
            always: [
              {
                target: "store",
                cond: "isLoggedIn",
                description: "Only save if user is logged in",
              },
              {
                target: "#youtube_search.no_access",
                description: "Move to no-access state",
              },
            ],
          },
          store: {
            description: "Persist changes to dynamo storage",  
            meta: {
              message: "Preview bookmark saved",
            },
            invoke: {
              src: "dynamoPersist",
              onDone: [
                {
                  target: "#youtube_search.idle",
                },
              ],
              onError: [
                {
                  target: "#youtube_search.no_access",
                },
              ],
            },
          },
        },
      },
  
  
      closing: {
        description: "send close event to calling component",
        invoke: {
          src: "emitClose",
          onDone: [
            {
              target: "idle",
              description: "Return to idle after closing window",
            },
          ],
        },
      },

      play: {
        description:
          "When FIND is called and the track is already pinned, emit the response for playing.",
        invoke: {
          src: "emitResponse",
          onDone: [
            {
              target: "#youtube_search.batch_lookup.next",
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
      ALOHA: {
        target: ".idle",
        actions: ["assignUser", 
        // (_,e) => alert('ALOHA:'+JSON.stringify(_.user))
      ],
        description: "User has logged into or out of the app",
      },
      MERGE: {
        target: ".dynamo",
        actions: "mergeImporteditems",
        description: "When items are merged from an imported JSON file",
      },
      CLEAR: {
        actions: "clearResponses",
        description: "Remove response from memory",
      },
      QUEUE: {
        actions: "assignQueue",
        description: "Add a track to the current playlist",
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
          target: ".closing",
          description:
            "If no more items in the batch, clear and return to idle.",
          actions: ["clearBatch", "clearResponses"],
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
      canProceed: (context) => {
        if (!context.items) return false;
        const selectedItem = !context.response?.pages
          ? {}
          : context.response.pages[0];
        const selectedIndex = context.items
          ?.map((item) => item.tubekey)
          .indexOf(selectedItem?.href);
        return selectedIndex < context.items.length - 1;
      },
      isLoggedIn: (context) => Boolean(context.user),
      isntPinned: (context) => {
        return !context.pins.some((f) => f.param === context.param);
      },
      isUnpinned: (context, event) => {
        return !context.pins.some((f) => f.param === event.param);
      },
      moreBatch: (context) => context.batch_index < context.batch.length,
      emptyBatch: context => !context.batch?.length
    },
    actions: {
      assignPinChange: assign((context, event) => {
        const pins = context.pins.map((f) =>
          f.param === event.pin.param ? event.pin : f
        );

        localStorage.setItem("tb-pins", JSON.stringify(pins));

        return {
          pins,
          pin: event.pin,
          items: context.items.map((item) =>
            item.tubekey === event.pin.tubekey ? event.pin : item
          ),
        };
      }),
      applyChanges: assign((_, event) => ({
        [event.key]: event.value,
      })),
      clearResponses: assign((_, event) => ({
        response: null,
        pin: null,
        track: {},
        open: false
      })),
      mergeImporteditems: assign((context, event) => {
        const { items } = event;
        
        const pins = items.reduce((out, item) => {
          if (out.some(f => f.trackId === item.trackId)) return out;
          return out.concat(item);
        }, context.pins)

        return { pins }; 

      }),
      assignPin: assign((context, event) => {
        const { response, response_index } = context;
        const { pin } = event;

        const exists = context.pins.some((f) => f.param === pin.param);

        if (!exists) {
          Object.assign(pin, { response_index, versions: response.pages })
        }

        const pins = exists
          ? context.pins.filter((f) => f.param !== pin.param)
          : context.pins.concat(pin);

        // console.log ({ exists, pins })

        localStorage.setItem("tb-pins", JSON.stringify(pins));

        return {
          pins,
          pin: exists ? null : pin,
       
          items: [pin],
          response: {
            ...response,
            pages: (pin.versions || response.pages).map((page) =>
              page.href === pin.tubekey
                ? {
                    ...page,
                    pinned: !exists,
                  }
                : page
            ),
          },
        };
      }),
      assignPersistedResponse: assign((context, event) => {
        const pin = context.pins.find((f) => f.param === event.param);
        const response = {
          pages: [
            {
              page: pin.title,
              href: pin.tubekey,
              pinned: 1,
            },
          ],
        };

        return {
          pin,
          param: event.param,
          track: event.track,
          items: event.items,
          response,
          folded: false,
          response_index: 0
        };
      }),
      initPins: assign((context, event) => {
        const pins =
          context.pins || JSON.parse(localStorage.getItem("tb-pins") || "[]");
   

        return {
           pins,
          groups:[],
          playlists: [],
          // response_index: 0
        };
      }),
      assignResponse: assign((_, event) => {
        const response = event.data;
        const first = response.pages[0];
        const regex = /v=(.*)/.exec(first.href);
        return {
          response,
          first,
          folded: false,
          videoId: regex[0],
          response_index: 0,
        };
      }),
      assignParam: assign((_, event) => ({
        param: event.param,
        items: event.items,
        track: event.track,
      })),

      incrementBatch: assign((context) => {
        const batch_index = context.batch_index + 1;
        const next_item = context.batch[batch_index];
        const batch_progress = Math.floor(
          100 * (batch_index / context.batch.length)
        );

        return {
          batch_index,
          batch_progress,
          param: next_item?.param,
        };
      }),

      persistResponse: assign((context, event) => {
        const old = context.batch[context.batch_index];
        const response = event.data;
        const first = response.pages[0];
        const batch_index = context.batch_index + 1;
        const batch_progress = Math.floor(
          100 * (batch_index / context.batch.length)
        );

        // alert (JSON.stringify(first))

        if (!first) {
          return {
            batch_index,
            batch_progress,
          };
        }

        const pin = {
          ...old,
          title: first.page,
          tubekey: first.href,
        };

        // alert (JSON.stringify(pin))

        const pins = context.pins.some((f) => f.param === pin.param)
          ? context.pins.filter((f) => f.param !== pin.param)
          : context.pins.concat(pin);

        localStorage.setItem("tb-pins", JSON.stringify(pins));
        const next_item = context.batch[batch_index];

        return {
          pins,
          pin,
          first,
          batch_index,
          batch_progress,
          param: next_item?.param,
        };
      }),

      advanceResponse: assign((context, event) => ({
        response_index: context.response_index + event.index
      })),

      assignByIndex: assign((context, event) => {
        const pin = context.items[event.index];

        const response = {
          pages: [
            {
              page: pin.title,
              href: pin.tubekey,
              pinned: 1,
            },
          ],
        };

        return {
          param: pin?.param,
          pin,
          track: pin,
          response,
        };
      }),

      setContextMessage: assign((context) => {
        return {
          message: context.currentState
        }
      }),

      assignQueue: assign((context, event) => {
        const { items } = context;
        const selectedItem = !context.response?.pages
          ? {}
          : context.response.pages[0];
        const selectedIndex = context.items
          ?.map((item) => item.tubekey)
          .indexOf(selectedItem?.href) + 1;

        items.splice(selectedIndex, 0, event.track);

        return {
          items
        }
      }),

      assignNext: assign((context, event) => {
        const selectedItem = !context.response?.pages
          ? {}
          : context.response.pages[0];
        const selectedIndex = context.items
          ?.map((item) => item.tubekey)
          .indexOf(selectedItem?.href);

        const track = context.items[selectedIndex + 1];

        const response = {
          pages: [
            {
              page: track.title,
              href: track.tubekey,
              pinned: 1,
            },
          ],
        };

        return {
          param: track?.param,
          track,
          pin: track,
          response,
        };
      }),

      clearBatch: assign({
        batch: null,
        param: null,
        // items: null,
        pin: null, 
        batch_progress: 0,
      }),
      removeUser: assign((_, event) => ({
        user: null,
      })),
      assignUser: assign((_, event) => ({
        user: event.user,
      })),
      appendBatch: assign((context, event) => ({
        batch: context.batch.concat(event.batch)
      })),
      appendTrack: assign((context, event) => ({
        batch: context.batch.concat(event.track)
      })),
      assignBatch: assign((_, event) => ({
        batch: event.batch,
        param: event.batch[0].param,
        batch_index: 0,
      })),
      applyPins: assign((_, event) => {
        // alert (1);
        // console.log({
        //   pins: event.data,
        // });
        return {
          pins: event.data,
        };
      }),
      applyDynamoItems: assign((_, event) => ({
        dynamoItems: event.data
      })),
      initBatch: assign({
        batch_index: 0,  
      }),
    },
  }
);

// This function exports a custom hook called useTube.
// It takes in two callbacks as arguments, onChange and onClose.
export const useTube = (onChange, onClose) => {
  // useMachine is a hook from the xstate library that returns a state machine and its interpreter.
  // Here, it's being used to create a state machine based on the tubeMachine object,
  // which is defined elsewhere in the codebase.
  // The services property of the configuration object passed to useMachine
  // defines the various asynchronous functions that the state machine can use as services.
  const [state, send] = useMachine(tubeMachine, {
    services: {
      // userSignOut is an asynchronous function that signs the user out of the app.
      // It returns a promise that resolves when the sign out is complete.
      userSignOut: async () => {
        return await Auth.signOut();
      },
      
      // emitClose is an asynchronous function that invokes the onClose callback.
      emitClose: async () => {
        onClose && onClose();
      },

      // identifyUser is an asynchronous function that returns information about the authenticated user.
      // It returns a promise that resolves with an object containing the user's attributes.
      identifyUser: async () => {
        return await Auth.currentAuthenticatedUser();
      },
 
      // emitResponse is an asynchronous function that invokes the onChange callback,
      // passing in the response from the context object as an argument.
      emitResponse: async (context) => {
        onChange && onChange(context.response);
      },

      // dynamoPersist is an asynchronous function that saves the state of the app to DynamoDB.
      // It returns a promise that resolves when the save is complete.
      dynamoPersist: async (context) => {
        if (!context.user) return;
        const { userDataKey } = context.user;  
        const filename = `web/${userDataKey}.json`; 

        try {
          const result = await Storage.put(filename, JSON.stringify(context.pins));
          console.log('File uploaded successfully with key:', result.key, context.pins);
          await new Promise(r => setTimeout(r, 2999));
          // console.log (' OK now lets %csee', 'color: lime')
          return result;
        } catch (error) {
          console.error('Error uploading file:', error);
        }
 
      }, 

      // dynamoLoad is an asynchronous function that loads the state of the app from DynamoDB.
      // It returns a promise that resolves with the saved state as a JSON object.

      dynamoLoad: async (context) => { 
        if (!context.user) return [];
 
        const { userDataKey } = context.user; 
        const filename = `web/${userDataKey}.json`;

        // const response = await Storage.head(filename);
        // console.log ({
        //   response
        // })


        const file = await Storage.get(filename, {
          download: true,
          contentType: 'application/json'
        });

        if (file?.Body) {  
          return await new Promise(resolve => { 
            try { 
              const reader = new FileReader();
              reader.readAsText(file.Body);
  
              reader.onload = () => {
                const json = JSON.parse(reader.result);
                // console.log ('JSON file retrieved:', json);
                resolve(json)
              };
            } catch (ex) {
              console.log (ex)
            } 
          }) 
        } 
        console.log ("No file body was received") 

        return false;
      },

      // execSearch is an asynchronous function that searches the YouTube API
      // using the search parameter passed in from the context object.
      // It returns a promise that resolves with the search results as an object.
      execSearch: async (context) => {
        return await searchTubeAPI(context.param);
      },
    },
  });

  const contains = (track) => state.context.pins?.some((f) => f.trackId === track.trackId); 

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
    ...state.context,
  };
};


const [REACT_APP_YT_API_KEY] = process.env.REACT_APP_API_KEY.split(',')
 
const searchTubeAPI = async (param) => {
  
  const TUBE_ENDPOINT =
  `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&key=${REACT_APP_YT_API_KEY}&q=`;
  
  const response = await fetch(TUBE_ENDPOINT + `${encodeURIComponent(param.replace(/\//g, ' '))}`); 
  const json = await response.json();
  const pins = {
    pages: json.items
    .filter(item => !!item.id.videoId)
    .map(item => ({
      href: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      page: item.snippet.title,
      image:  item.snippet.thumbnails.default.url
    }))
  }; 
  return pins;
};
    

