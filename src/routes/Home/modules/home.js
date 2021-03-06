import update from "react-addons-update";
import constants from "./actionConstants";
import { Dimensions } from 'react-native';
import RNGooglePlaces from 'react-native-google-places';

//=================
// constants
const { GET_CURRENT_LOCATION, GET_INPUT, TOGGLE_SEARCH_RESULT,
        GET_ADDRESS_PREDICTIONS,
} = constants;

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

//=================
// actions

// get user's current location
export function getCurrentLocation() {
    return (dispatch) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                dispatch({
                    type: GET_CURRENT_LOCATION,
                    payload: position
                });
            },
            (error) => console.log("Error", error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }
}

// get user input
export function getInputData(payload) {
    return {
        type: GET_INPUT,
        payload
    }
}

// Toggle search result modal
export function toggleSearchResultModal(payload) {
    return {
        type: TOGGLE_SEARCH_RESULT,
        payload
    }
}

// Get address predictions from Google Places
export function getAddressPredictions() {
    return (dispatch, store) => {
        let userInput = store().home.resultTypes.pickUp ? store().home.inputData.pickUp : store().home.inputData.dropOff;
        RNGooglePlaces.getAutocompletePredictions(userInput)
        .then ((results) => 
            dispatch({
                type: GET_ADDRESS_PREDICTIONS,
                payload: results
            })
        )
        .catch((error) => console.log("Error getting address predictions: ", error));
    };
}

//=================
// action handlers
function handleGetCurrentLocation(state, action) {
	return update(state, {
		region: {
			latitude: {
                $set: action.payload.coords.latitude
            },
            longitude: {
                $set: action.payload.coords.longitude
            },
            latitudeDelta: {
                $set: LATITUDE_DELTA
            },
            longitudeDelta: {
                $set: LONGITUDE_DELTA
            }
		}
	})
}

function handleGetInputData(state, action){
    const { key, value } = action.payload;
    return update(state, {
        inputData: {
            [key]: {
                $set: value
            }
        }
    });
}

function handleToggleSearchResult(state, action){
    if(action.payload === "pickUp") {
        return update(state, {
            resultTypes: {
                pickUp: {
                    $set: true,
                },
                dropOff: {
                    $set: false
                }
            },
            predictions: {
                $set:{}
            }
        });
    } else if (action.payload === "dropOff") {
        return update(state, {
            resultTypes: {
                pickUp: {
                    $set: false,
                },
                dropOff: {
                    $set: true,
                }
            },
            predictions: {
                $set:{}
            }
        });
    }
}

function handleGetAddressPredictions(state, action) {
    return update(state, {
        predictions: {
            $set: action.payload
        }
    })
}

const ACTION_HANDLERS = {
    GET_CURRENT_LOCATION: handleGetCurrentLocation,
    GET_INPUT: handleGetInputData,
    TOGGLE_SEARCH_RESULT: handleToggleSearchResult,
    GET_ADDRESS_PREDICTIONS: handleGetAddressPredictions,
}

const initialState = {
    region:{},
    inputData:{},
    resultTypes:{},
};

export function HomeReducer (state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}

// export function setName() {
//     return {
//         type:SET_NAME,
//         payload:"Garry"
//     }
// }

// function handleSetName(state, action){
//     return update(state, {
//         name: {
//             $set:action.payload
//         }
//     })
// }
