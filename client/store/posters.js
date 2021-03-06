import axios from "axios";

/**
 * ACTION TYPES
 */
const GET_ALL_POSTERS = "GET_ALL_POSTERS";
const SET_POSTER = "SET_POSTER";
const REMOVE_POSTER = "REMOVE_POSTER";
const ADMIN_UPDATE_POSTER = "ADMIN_UPDATE_POSTER";

/**
 * ACTION CREATORS
 */
const setPosters = (posters) => ({ type: GET_ALL_POSTERS, posters });


const createAPoster = (poster) => ({
  type: SET_POSTER,
  poster
})

const removeAPoster = (poster) => ({
  type: REMOVE_POSTER,
  poster
})

const adminUpdatePoster = (poster) => ({
  type: ADMIN_UPDATE_POSTER,
  poster,
});
/**
 * THUNK CREATORS
 */
export const getAllPosters = () => {
  return async (dispatch) => {
    const { data } = await axios.get("/api/posters");
    const posters = data;
    dispatch(setPosters(posters));
  };
};

export const createPosterThunk = (token, poster, history) => {
  return async (dispatch) => {
    try{
      const { data } = await axios.post('/api/admin/posters',{ params: {
        boo: token,
        data: poster
      }});
      dispatch(createAPoster(data))
      history.push("/admin/posters")
    } catch (err) {
      console.log(err);
    }
  }
}

export const removePosterThunk = (id, token, history) => {
  return async (dispatch) => {
    try{
      const { data } = await axios.delete(`/api/admin/posters/${id}`,{ params: {
        boo: token
      }})
      dispatch(removeAPoster(data))
      history.push("/admin/posters")
    } catch (err) {
      console.log(err);
    }
  }
}

export const adminUpdateSinglePoster = (id, poster, token, history) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.put(`/api/admin/posters/${id}`,{ params: {
        boo: token,
        data: poster
      }});
      dispatch(adminUpdatePoster(data));
      history.push("/admin/posters")
    } catch (err) {
      console.log(err);
    }
  };
};

/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case GET_ALL_POSTERS:
      return action.posters;
    case REMOVE_POSTER:
      return state.filter((poster) => poster.id !== action.poster.id)
    case SET_POSTER:
      return [...state, action.poster]
    case ADMIN_UPDATE_POSTER:
      return state.map((poster) =>
      poster.id === action.poster.id ? action.poster : poster
    );
    default:
      return state;
  }
}