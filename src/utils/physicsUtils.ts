export { Vec }

/**
 * A simple immutable vector class
 */
class Vec {
    constructor(public readonly x: number = 0, public readonly y: number = 0) { }
    add = (b: Vec) => new Vec(this.x + b.x, this.y + b.y)
    sub = (b: Vec) => this.add(b.scale(-1))
    len = () => Math.sqrt(this.x * this.x + this.y * this.y)
    scale = (s: number) => new Vec(this.x * s, this.y * s)
    ortho = () => new Vec(this.y, -this.x)
    rotate = (deg: number) =>
        (rad => (
            (cos, sin, { x, y }) => new Vec(x * cos - y * sin, x * sin + y * cos)
        )(Math.cos(rad), Math.sin(rad), this)
        )(Math.PI * deg / 180)

    static unitVecInDirection = (deg: number) => new Vec(0, -1).rotate(deg)
    static Zero = new Vec();
}