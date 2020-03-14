let canvas = document.getElementById('canvas');

canvas.width = window.innerWidth-10;
canvas.height = window.innerHeight-10;

let ctx = canvas.getContext('2d');



class Ball{
  constructor (x, y, radius, startA, endA, acw, link,fade) {
    this.x = x
    this.y = y
    this.radius = radius
    this.startA = startA
    this.endA = endA
    this.acw = acw
    this.link = link
    this.fade = fade
    this.connectedBy = []
    this.connectedTo = []
    this.reverse = false

  }

  draw (balls) {
    let limit = 1
    let counter = 0

    for(let i = 0;i<balls.length;i++){
      if (counter === limit) { break }
      if (balls[i].connectedBy.length > 0) {continue}


      if (this.x === balls[i].x && this.y === balls[i].y){
        continue

      } else {
        let x1 = balls[i].x
        let y1 = balls[i].y

        this.connectedTo = []
        this.connectedBy = []

        this.connectedTo.push([x1,y1])
        balls[i].connectedBy.push([this.x,this.y])

        //ctx.font = "14px Arial";
        //ctx.fillText(this.connectedTo, this.x+20, this.y+30);

        ctx.beginPath();
        ctx.moveTo(this.x,this.y)
        ctx.lineTo(x1,y1)

        ctx.stroke()
        ctx.strokeStyle = `rgba(130, 130, 130, ${this.fade})`
        ctx.lineWidth = 1.75
        counter ++
        balls[i].connected ++

      }
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, this.startA, this.endA);
    ctx.fillStyle = `rgba(130, 130, 130, ${this.fade})`;
    ctx.fill();
  }

  move () {
    if (this.x + this.radius > canvas.width - 100){
      this.reverse = true;
    }
    if (this.x - this.radius < 100){
      this.reverse = false;
    }

    let random = Math.round(Math.random()) * 2 - 1
    this.y = this.y + random/4
    this.fade = this.fade - 0.05

    if (this.reverse  === false){
      this.x = this.x + 1
    } else {
      this.x = this.x - 1
    }

  }
}














class Enviroment{
  constructor(amount) {
    this.amount = amount
    this.ball_lst = []

  }

  clear_rect () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  random (min,max){
    return min + Math.random() * (max - min);
  }


  ball_creator (i) {
    let radius = (Math.random(10) * 5) + 5
    let x = this.random(100,window.innerWidth-100)
    let y = this.random(100,window.innerHeight-100)
    let new_ball = new Ball(x,y, radius, 0, 2 * Math.PI, false,2,(Math.random()*100)+100)
    this.ball_lst.push(new_ball)
  }

  ball_generator () {

    let limit = this.amount - this.ball_lst.length
    for (let i = 0; i < limit; i++) {
      this.ball_creator(i)
    }
  }

  run_env () {

    for (let i=0; i < this.ball_lst.length; i++){
        this.ball_lst[i].draw(this.ball_lst)
        this.ball_lst[i].move()
    }
  }

  ball_destoyer () {
    for (let i = 0; i < this.ball_lst.length; i++) {

      let fade = this.ball_lst[i].fade
      if (fade < 0.4) {

        this.ball_lst.splice(i,1)
      } else {
        let x = this.ball_lst[i].x
        let y = this.ball_lst[i].y
        let r = this.ball_lst[i].radius

        if (x + r > canvas.width || x - r < 0){
          this.ball_lst.splice(i,1)

        }
        if (y + r > canvas.height || y - r < 0){
          this.ball_lst.splice(i,1)

        }
      }
    }
  }

}



let board1 = new Enviroment(25)
board1.ball_generator()


let myInterval = setInterval(function(){
  board1.clear_rect()
  board1.run_env()
  board1.ball_destoyer()
  board1.ball_generator()

},50)
