class char{
    constructor(main,url,x,y,width,height){
        if(!main||!url||!x||!y||!width||typeof width!='number'||!height||typeof height!='number')throw new Error('lacking of paraments')
        Object.assign(this,{main,x,y,url})
        this.width=width
        this.height=height
        this.groundY=this.fakeGround=this.groundBaseY=this.y
        this.y-=this.height
        this.canvas=main.canvas
        this.img=new Image()
        this.img.src=url
        this.clipSet={
            stayForward:{id:'sf',base:6,use:[6,0,22,36],now:0,max:0,space:818/16,delay:10},
            stayBackward:{id:'sb',base:6,use:[6,51,22,36],now:0,max:0,space:818/16,delay:10},
            jumpForward:{id:'jf',base:6,use:[6,505,22,44],now:0,max:16,space:818/16,delay:0},
            jumpBackward:{id:'jb',base:8,use:[8,556,26,44],now:0,max:16,space:818/16,delay:0},
            runForward:{id:'rf',base:9,use:[9,307,26,36],now:0,max:16,space:818/16,delay:-1},
            runBackward:{id:'rb',base:4,use:[4,358,24,36],now:0,max:16,space:818/16,delay:-1}
        }
        this.count=0
        this.clip=this.clipSet.stayForward
        this.ctx=main.ctx
        this.blocks=this.main.block.block
        this.gtX=0.4
        this.gtBaseY=0.87
        this.gtIBaseY=2-this.gtBaseY
        this.limitZone=80
        this.re=false
        this.gtY=0
        this.limitX=10
        this.vtBaseX=7
        this.vtBaseY=30
        this.jumping=false
        this.jumpLimit=this.height+120
        this.vtX=0
        this.vtY=0
    }
    update(){
        let hitTop=this.blocks.filter(e=>this.x+this.main.x<e[1]+e[3]&&this.x+this.width+this.main.x>e[1]&&this.y<=e[2]+e[4]&&this.y>e[2]+e[4]-20)
        for(var i of hitTop){
            this.y=i[2]+i[4]
            this.main.block.vibrate(i)
        }
        let hitRight=this.blocks.find(e=>this.x+this.width+this.main.x>e[1]&&this.x+this.width+this.main.x<=e[1]+this.vtX&&this.y<e[2]+e[4]&&this.y+this.height>e[2]),
            hitLeft=this.blocks.find(e=>this.x+this.main.x<=e[1]+e[3]&&this.x+this.main.x>=e[1]+this.vtX&&this.y<e[2]+e[4]&&this.y+this.height>e[2])
        if(this.vtX>0&&hitRight||this.vtX<0&&hitLeft){
            this.x=this.vtX>0?hitRight[1]-this.width-this.main.x:hitLeft[1]+hitLeft[3]-this.main.x
            this.vtX=0
        }
        if(this.x+this.width<this.canvas.width-this.limitZone&&this.vtX>0||this.x>this.limitZone&&this.vtX<0){
            this.x+=this.vtX
        }else if (this.main.x+this.vtX>=0){
            let l= this.main.bg[this.main.bg.length-1]
            if(this.main.x+10>l.x){
                this.main.bg.push({x:l.x+this.main.width,y:0})
            }
            this.main.x+=this.vtX
        }
        if(this.re)if(this.vtX<-this.gtX)this.vtX+=this.gtX
        else if(this.vtX>this.gtX)this.vtX-=this.gtX
        else {this.re=false;this.vtX=0}
        
        let hitBot=Math.min(...this.blocks.filter(e=>this.y+this.height<=e[2]&&this.x+this.width+this.main.x>e[1]&&this.x+this.main.x<e[1]+e[3]).map(e=>e[2]))
        
        if(hitBot!=Infinity&&hitBot){
            this.groundY=hitBot
        }else this.groundY=this.groundBaseY
        if(this.fakeGround-(this.y+this.height)>this.jumpLimit||hitTop.length){
            this.vtY=-this.vtY
            this.gtY=this.gtIBaseY
        }
        this.vtY*=this.gtY
        this.y+=this.vtY
        if(this.y+this.height>=this.groundY){
            this.fakeGround=this.groundY
            this.y=this.groundY-this.height
            this.gtY=0
            this.vtY=0
            this.jumping=false
        }else{
            if(!this.vtY){
                this.gtY=this.gtIBaseY
                this.vtY=8
            }
        }

    }
    draw(){
        let bf=this.clip
        if(this.vtX<0){
            this.clip=this.jumping?this.clipSet.jumpBackward:this.clipSet.runBackward
        }
        else if(this.vtX>0){
            this.clip=this.jumping?this.clipSet.jumpForward:this.clipSet.runForward
        }else{
            this.clip=bf.id.includes('f')?this.clipSet.stayForward:this.clipSet.stayBackward
        }
        if(bf.id!=this.clip.id){
            this.clip.now=0
            this.count=100
        }
        if(this.count++>this.clip.delay){
            this.count=0
            if(this.clip.now>=this.clip.max)this.clip.now=0
            this.clip.use[0]=this.clip.base+this.clip.space*this.clip.now++
        }
        this.ctx.drawImage(this.img,...this.clip.use,this.x,this.y,this.width,this.height)
    }
}