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
                },
                dashboardButton:{
                    bg:"rgb(41, 39, 39)",
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
        },
        Card:{
            variants:{
                normalCard:{
                    _hover:{ boxShadow: 'lg' },
                     transition:"box-shadow 0.3s",
                     bg:'red'
                },
                baseStyle: {
                    borderWidth: '1px',
                    borderRadius: 'lg',
                    boxShadow: 'sm',
                    bg:'green'
                  },

            }
        }
    }
})

export default theme;
