

function AnimatedBackground (){
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-300 opacity-90"></div>
      <div className="absolute inset-0 animate-slide">
        <img
          src="https://t3.ftcdn.net/jpg/09/63/69/26/240_F_963692622_WxAlwE1FFflvYtI6ixcutsTt4eIXLI4z.jpg"
          alt="Luxury Car"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 animate-slide-delayed">
        <img
          src="https://t4.ftcdn.net/jpg/10/36/41/33/240_F_1036413333_52deFSdBpfz9AK1t8chLfsffs7z31tIn.jpg"
          alt="Modern House"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default AnimatedBackground

