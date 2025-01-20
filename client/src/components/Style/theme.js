import { extendTheme } from '@chakra-ui/react'



const theme  =  extendTheme ({
    components:{
        Button:{
            variants:{
                customButton:{
                    bg: 'black',
                    color:'white',
                    borderRadius: "md",
                    _hover:{
                        bg:'white',
                        color:"black",
                        borderRadius:'md',
                        border:'1px solid black',
                        cursor:'pointer',
                    }
                }
            }
        }
    }
})

export default theme;
