import {Corners} from './Corners'
import {Edges} from './Edges'


class State {
  public corners = new Corners()
  public edges = new Edges()

  public apply(turn: Turn) {
    this.corners.apply(turn)
    this.edges.apply(turn)
  }
}

export {
  State
}