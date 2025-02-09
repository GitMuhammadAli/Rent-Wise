

self.addEventListener("push",(event)=>{
    const data = event.data.jsno();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon
    })
})