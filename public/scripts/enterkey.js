
export function listenEnter(textid,event){
    console.log(textid,event)
    document.getElementById(textid).addEventListener('keypress',function(e){
        console.log(e.keyode)
        if (e.keyCode==13){
            event()
        }
        
    })
}
//listenerCount('chatmessage',)

console.log('enter key script loaded')