type Corner = 'URF' | 'ULF' | 'ULB' | 'URB' | 'DRF' | 'DLF' | 'DLB' | 'DRB'
type Orientation = 0 | 1 | 2

const order: Corner[] = ['URF', 'ULF', 'ULB', 'URB', 'DRF', 'DLF', 'DLB', 'DRB']

const permutations: Record<Turn, Corner[]> = {
  R: ['DRF', 'ULF', 'ULB', 'URF', 'DRB', 'DLF', 'DLB', 'URB'],
  L: ['URF', 'ULB', 'DLB', 'URB', 'DRF', 'ULF', 'DLF', 'DRB'],
  U: ['URB', 'URF', 'ULF', 'ULB', 'DRF', 'DLF', 'DLB', 'DRB'],
  D: ['URF', 'ULF', 'ULB', 'URB', 'DLF', 'DLB', 'DRB', 'DRF'],
  F: ['ULF', 'DLF', 'ULB', 'URB', 'URF', 'DRF', 'DLB', 'DRB'],
  B: ['URF', 'ULF', 'URB', 'DRB', 'DRF', 'DLF', 'ULB', 'DLB']
}

const orientations: Record<Turn, Orientation[]> = {
  R: [2, 0, 0, 1, 1, 0, 0, 2],
  L: [0, 1, 2, 0, 0, 2, 1, 0],
  U: [0, 0, 0, 0, 0, 0, 0, 0],
  D: [0, 0, 0, 0, 0, 0, 0, 0],
  F: [1, 2, 0, 0, 2, 1, 0, 0],
  B: [0, 0, 1, 2, 0, 0, 2, 1]
}

class Corners {
  public permutation = [...order]
  public orientation = Array<Orientation>(8).fill(0)

  public apply(turn: Turn) {
    const appliedPermutation = permutations[turn]
    const appliedOrientation = orientations[turn]

    const permutation = [...this.permutation]
    const orientation = [...this.orientation]
    
    for (let i = 0; i < 8; i++) {
      const newPermutation = appliedPermutation[i]
      const orderIndex = order.indexOf(newPermutation)
      this.permutation[i] = permutation[orderIndex]
      const newOrientation = (appliedOrientation[i] + orientation[orderIndex]) % 3
      this.orientation[i] = newOrientation as Orientation
    }
  }
}

export {
  Corners
}