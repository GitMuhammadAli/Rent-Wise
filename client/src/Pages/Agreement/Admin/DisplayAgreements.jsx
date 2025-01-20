"use client"

import { useEffect, useState } from "react"
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Container, Heading } from "@chakra-ui/react"
import { getAggrementForAdminByOwnerIDs } from "../../../Api/Blockchain";
import {useNavigate} from 'react-router-dom'
import Integration from "./Integration";


export default function DisplayAgreements() {
  const navigate = useNavigate()
  const [agreements, setAgreements] = useState([]);
  const [showCompoenent, setShowComponent] = useState(false);
  const [IdToSend, setIdToSend] = useState('');
  
  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        // Replace this URL with your actual API endpoint
        const response = await getAggrementForAdminByOwnerIDs();
        console.log("res", response?.data?.data);
      setAgreements(response?.data?.data);
       
      } catch (error) {
        console.error("Error fetching agreements:", error)
      }
    }

    fetchAgreements()
  }, [])

  const handleDeploy = (id)=>{
    // console.log("aggIID", agreementId)
    // navigate(`/integration/${agreementId}`)
    setShowComponent(true);
    setIdToSend(id)
    

  }



  return (
    <Container maxW="container.lg" py={10}>
      <Box overflowX="auto">
        <Heading color={'blue.500'} mb={10} display={'flex'} justifySelf={'center'}>Non Blochchain Agreements</Heading>
        <Table variant="striped" mb={'20px'}>
          <Thead>
            <Tr bg={'gray.300'}  >
              <Th>Agreement ID</Th>
              <Th>Blockchain Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {agreements.map((agreement) => (
              <Tr key={agreement._id}>
                <Td>{agreement._id}</Td>
                {
                  agreement.blockchainStatus === false ? (
                    <Td>Not on Blockchain</Td>
                  ) :(<Td>On blochain Already</Td>)
                }
              
                <Td>
                  <Button colorScheme="blue" onClick={() => handleDeploy(agreement._id)}>
                    Deploy on Blockchain
                  </Button>
                </Td>
              </Tr>
            ))}

          </Tbody>
        </Table>
        {
          showCompoenent && IdToSend && (
            <Integration agreementId={IdToSend} />
          )
        }
       
      </Box>
    </Container>
  )
}
