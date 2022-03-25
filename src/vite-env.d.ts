/// <reference types="vite/client" />


declare type Axis = 'x' | 'y' | 'z'
declare type TurnDirections = {right: [Axis, number], down: [Axis, number]}
declare type Side = 'up' | 'down' | 'left' | 'right' | 'forward' | 'back'