import { createContext, useReducer, useRef } from "react";
import * as faceapi from "face-api.js";
const CVContext = createContext(null);

function CVContextProvider({ children }) {
	const [labelStream, dispatchLabelStream] = useReducer(streamReducer, null);
	const [recognizeStream, dispatchRecognizeStream] = useReducer(
		streamReducer,
		null,
	);
	const [labeledFaces, dispatchLabeledFaces] = useReducer(
		labeledFacesReducer,
		[],
	);
	const [faceCollection, dispatchFaceCollection] = useReducer(
		labeledFacesReducer,
		[],
	);
	const [detectedFace, dispatchDetectedFace] = useReducer(
		detectedFaceReducer,
		{ src: null, errorMessage: null },
	);
	const [activeStreams, dispatchActiveStreams] = useReducer(
		streamReducer,
		null,
	);
	return (
		<CVContext.Provider
			value={{
				labelStream,
				recognizeStream,
				dispatchLabelStream,
				dispatchRecognizeStream,
				labeledFaces,
				dispatchLabeledFaces,
				faceCollection,
				dispatchFaceCollection,
				detectedFace,
				dispatchDetectedFace,
				faceapi,
				activeStreams,
				dispatchActiveStreams,
			}}
		>
			{children}
		</CVContext.Provider>
	);
}
function labeledFacesReducer(state, action) {
	switch (action.type) {
		case "added": {
			return [...state, action.payload];
		}
		default: {
			return state;
		}
	}
}
function detectedFaceReducer(state, action) {
	switch (action.type) {
		case "set_src": {
			return Object.assign({ ...state }, { src: action.payload });
		}
		case "set_error_message": {
			return Object.assign(
				{ ...state },
				{ errorMessage: action.payload },
			);
		}
		case "reset": {
			return {
				src: null,
				errorMessage: null,
			};
		}
		default: {
			return state;
		}
	}
}
function streamReducer(state, action) {
	switch (action.type) {
		case "set": {
			return action.payload;
		}
		case "clear": {
			return null;
		}
		case "added": {
			return [...state, action.payload];
		}
		default: {
			return state;
		}
	}
}
export { CVContextProvider, CVContext };
