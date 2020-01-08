import { Action } from '@ngrx/store'
import { Favorite } from '../models/favorite.model'
import * as FavoriteActions from '../actions/favorite.actions'

const initialState: Favorite = {
    name: 'Tel Aviv',
    idKey: '215854',
    currentWeather:'13'
}

export function reducer(state: Favorite[] = [initialState], action: FavoriteActions.Actions) {

    switch(action.type) {
        case FavoriteActions.ADD_FAVORITE:
            for(const fav of state) {
                if (fav.idKey === action.payload.idKey) {
                    return state 
                    break;}}
                   return  [...state, action.payload];
        case FavoriteActions.REMOVE_FAVORITE:
            state.splice(action.payload, 1)
            return state;
        default:
            return state;
    }
}