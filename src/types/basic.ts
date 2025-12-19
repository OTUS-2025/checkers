type Row = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
type Column = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
const COLORS_SET = ['black', 'white', 'none'] as const

class Color {
  private readonly _value: string
  private readonly _availableColors: string[] = [...COLORS_SET]

  constructor(color: string) {
    this._value = this._availableColors.includes(color) ? color : 'white'
  }

  get color(): string {
    return `${this._value}`
  }
}

class Position {
  private _row: Row
  private _col: Column

  constructor(col: Column, row: Row) {
    this._row = Position.isValidRow(row) ? row : '1'
    this._col = Position.isValidColumn(col) ? col : 'A'
  }
  // Валидаторы
  private static isValidColumn(col: string) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].includes(col)
  }

  private static isValidRow(row: string) {
    return ['1', '2', '3', '4', '5', '6', '7', '8'].includes(row)
  }

  private static isValid(pos: Position) {
    return this.isValidRow(pos._row) && this.isValidColumn(pos._col)
  }

  get position(): string {
    return `${this._col}${this._row}`
  }
}

class Checker {
  private _pos: Position
  private _color: Color
  private _isKing: boolean

  constructor(col: Column, row: Row, color: string) {
    this._pos = new Position(col, row)
    this._color = new Color(color)
    this._isKing = false
  }

  get position(): string {
    return this._pos.position
  }

  get elementId(): string {
    return `#${this.position}`
  }

  get color(): string {
    return `${this._color.color}`
  }

  get isKing(): boolean {
    return this._isKing
  }
}

export default Checker
