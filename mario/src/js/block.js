class Block{
    constructor(main){
        this.main=main
        this.ctx=this.main.canvas.getContext('2d')
        this.vibrateRate=1,
        this.vibrateDuration=10
        this.vibrateTime=10
        this.block=[]
    }
    post(url,x,y,width,height){
        let img = new Image()
        img.src=url
        this.block.push([img,x,this.main.char.groundY-y-height,width,height])
    }
    draw(){
        for(var i of this.block){
            this.ctx.drawImage(i[0],i[1]-this.main.x,i[2],i[3],i[4])
        }
    }
    vibrate(i){
        let til=this.vibrateTime,count=0
        ,inter=setInterval(() => {
            count++
            if(count>2*til)return clearInterval(inter)
            if(count>til){
                i[2]+=this.vibrateRate
            }else{
                i[2]-=this.vibrateRate
            }
        }, this.vibrateDuration);
    }
}