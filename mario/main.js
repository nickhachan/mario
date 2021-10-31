class game{
    constructor(canvas,background={url,width,height,maxWidth},character={url,width,height}){
        this.canvas=canvas
        this.ctx=canvas.getContext('2d')
        this.width=this.canvas.width=background.width
        this.height=this.canvas.height=background.height
        this.block= new Block(this)
        this.char=new char(this,character.url,100,this.height*85/100,character.width,character.height)
        this.post=this.block.post.bind(this.block)
        this.background=new Image(this.width,this.height)
        this.background.src=background.url 
        this.bg=[{x:0,y:0}]
        this.x=0
        this.init()
        this.background.onload=()=>{
            this.loop()
        }
    }
    init(){
        this.canvas.focus()
        this.movement()
    }
    loop(){
        this.update()
        this.draw()
        this.interval= setTimeout(e=>this.loop(),30)
    }
    draw(){
        this.ctx.clearRect(0,0,this.width,this.height)
        this.drawBackground()
        this.char.draw()
        this.block.draw()
    }
    drawBackground(){
        for(var i of this.bg){
            if(this.x<i.x+this.width&&this.x+this.width>i.x)this.ctx.drawImage(this.background,i.x-this.x,i.y,this.width,this.height)
        }
    }
    update(){
        this.char.update()
    }
    movement(){
        let pos=[68,65]
        this.canvas.onkeydown=e=>{
            if(e.repeat)return
            this.char.re=false
            switch(e.which){
                case 68:    
                    this.char.vtX=this.char.vtBaseX
                    break
                case 65:
                    this.char.vtX=-this.char.vtBaseX
                    break
                case 87:
                case 32:
                    if(!this.char.jumping){
                        this.char.vtY=-this.char.vtBaseY
                        this.char.gtY=this.char.gtBaseY
                        this.char.jumping=true
                    }
                    break
            }
        }
        this.canvas.onkeyup=e=>{
            if(pos.includes(e.which)){
                this.char.re=true
            }
        }
    }
}
const bg ={url:'./src/img/background.jpg',width:700,height:500},
character={url:'./src/img/mario.png',width:40,height:50},
block={url:'./src/img/rock.jpg',width:50,height:50}
var g= new game(document.querySelector('.screen'),bg,character,block)
g.post('./src/img/rock.jpg',500,100,50,50)
g.post('./src/img/rock.jpg',550,100,50,50)
g.post('./src/img/rock.jpg',400,100,50,50)
g.post('./src/img/rock.jpg',450,100,50,50)
g.post('./src/img/rock.jpg',350,100,50,50)
g.post('./src/img/rock.jpg',450,250,50,50)