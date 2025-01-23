

function AnimatedBackground (){
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-90"></div>
      <div className="absolute inset-0 animate-slide">
        <img
          src="/placeholder.svg?height=1080&width=1920&text=Luxury+Car"
          alt="Luxury Car"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 animate-slide-delayed">
        <img
          src="/placeholder.svg?height=1080&width=1920&text=Modern+House"
          alt="Modern House"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default AnimatedBackground

