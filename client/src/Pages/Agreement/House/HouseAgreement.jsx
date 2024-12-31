import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import {
  Box,
  Heading,
  Input,
  Text,
  VStack,
  ListItem,
  OrderedList,
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/AuthContext';


export default function HouseAgreement({tenantName,tenantListing,conversationID}) {
//   const location = useLocation();
//     const { tenantName, tenantListing , conversationID } = location.state || {};

const { user } = useAuth();

  const [formData, setFormData] = useState({
    date: '',
    rentAmount: '',
    startDate: '',
    endDate: '',
    advanceRent: '',
    advanceRentMonths: '',
    securityDeposit: '',
    securityDepositMonths: '',
    rentIncreasePercentage: '',
    agreementPoints: [
      { id: 1, text: 'That the Tenant will allow the landlord or their authorised person to visit the property to view the condition at a 24-hours prior notification.' }, 
      { id: 2, text: 'That the Tenant will be responsible for maintaining the property in good condition and will hand over the possession of the property to the rightful owner upon termination of the rental agreement.' }, 
      { id: 3, text: 'That the residing Tenant will not make any changes, additions, and modifications to the said premises.' }, 
      { id: 4, text: 'That either party shall provide a four (04) week written notice to the other for the termination of the rental contract.' }, 
      { id: 5, text: 'That on the expiration of the contract duration , this rental agreement can be extended/renewed by a consensual agreement from both sides for any further period, the Tenant will give the vacant possession of the said property.' }, 
      { id: 6, text: 'That the Tenant will not be allowed to use the said property for any illegal activity or business.' }, 
      { id: 7, text: 'That the tenant will submit the due rent regularly for the tenancy period and shall be responsible for paying water, electricity, maintenance, and other bills. The photocopy of these bills shall be submitted to the landlord in due time.That the Tenant will not be allowed to use the said property for any illegal activity or business.' }, 
      { id: 8, text: 'Both the parties have finalised the contract by themselves after satisfaction and inspection of premises, including title documents and legal right of the landlord to rent as well as status and credentials of each other.' }, 
   
     
    ]
  
  });

    useEffect(() => {
    if (!tenantName || !tenantListing || !conversationID) {
      return;
    }
    // console.log(tenantListing, tenantName , conversationID);
    // console.log("COnversationID", conversationID);
    // setListingDetail(tenantListing);
    // console.log("tentantIDD", tenantName._id);
    // setRenterId(tenantName._id);
    // setConversationId(conversationID);
  }, [tenantName, tenantListing , conversationID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  
  return (
    <Box maxW="4xl" mx="auto" p={6} bg="white" boxShadow="lg" borderRadius="lg">
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Rental Agreement
      </Heading>
      <VStack spacing={4} align="start" fontSize="sm">
        <Text>
          This rent agreement is being created, on this day of
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
          date.
        </Text>

        <Text fontWeight="bold">BETWEEN</Text>
        {
          user &&  (
            <Text borderBottom={'1px solid gray'}>{user.name}</Text>

          )
        }

       

        <Text>Hereinafter known as the "landlord" of the one part.</Text>

        <Text fontWeight="bold">AND</Text>
        
        
            <Text borderBottom={'1px solid gray'}>{tenantName.name || ''}</Text>
          
        

       

        <Text>Hereinafter known as the 'tenant' of the other part.</Text>

        <Text>
          Whereas the landlord confirms that he is legally competent to rent out
          ______________________________ ____________________________________________________ with necessary electrical fittings
          and fixtures therein. The landlord has agreed to rent and the other party has agreed to accept the rent of said property.
        </Text>

        <Text fontWeight="bold">NOW, THEREFORE, THIS AGREEMENT IS WITNESSETH AS UNDER:-</Text>

        <OrderedList spacing={2}>
          <ListItem>
            That the payment due each month for the property will be Rs.
            <Input
              type="number"
              name="rentAmount"
              value={formData.rentAmount}
              onChange={handleChange}
              display="inline-block"
              w="32"
              mx={2}
            />
            .
          </ListItem>
          <ListItem >
            That the duration for the contract shall be 
            <Input
              type="number"
              name="duration"  //added
              placeholder={'12'}
              value={formData.duration}
              onChange={handleChange}
              display="inline-block"
              w="32"
              mx={2}
            />
             <Input
              type="text"
              placeholder={'days/week/month'} //added
              name="timePeriod"
              value={formData.timePeriod}
              onChange={handleChange}
              display="inline-block"
              w="32"
              mx={2}
            /> The agreement shall initiate from
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            and expire on
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            .
          </ListItem>
          <ListItem>
            That the property will not be sublet and will not be used for illegal activities or any other reason but 'Residential" use only.
          </ListItem>
          <ListItem>
            That the Landlord has received from the tenant a sum of Rs.
            <Input
              type="number"
              name="advanceRent"
              value={formData.advanceRent}
              onChange={handleChange}
              display="inline-block"
              w="32"
              mx={2}
            />
            being the
            <Input
              type="number"
              name="advanceRentMonths"
              value={formData.advanceRentMonths}
              onChange={handleChange}
              display="inline-block"
              w="20"
              mx={2}
            />
            month's advance rent and Rs.
            <Input
              type="number"
              name="securityDeposit"
              value={formData.securityDeposit}
              onChange={handleChange}
              display="inline-block"
              w="32"
              mx={2}
            />
            being the
            <Input
              type="number"
              name="securityDepositMonths"
              value={formData.securityDepositMonths}
              onChange={handleChange}
              display="inline-block"
              w="20"
              mx={2}
            />
            month's Security Fixed Deposit.
          </ListItem>
          <ListItem>
            That the Tenant will submit the monthly due rent to the homeowner/Landlord on or before the date 
            <Input
              type="number"
              name="monthlyDueDate"
              placeholder='5'
              value={formData.monthlyDueDate} // added
              onChange={handleChange}
              display="inline-block"
              w="20"
              mx={2}
            />
             of every calendar month till the expiry of the rent agreement.
          </ListItem>
         
           <ListItem>
            That both parties involved in the agreement have decided to increase
            <Input
              type="number"
              name="rentIncreasePercentage"
              value={formData.rentIncreasePercentage}
              onChange={handleChange}
              display="inline-block"
              w="20"
              mx={2}
            />
            % rent every year.
          </ListItem>
          {formData.agreementPoints.map((point, index) => (
          <ListItem key={point.id}>
            <Text>{point.text}</Text>
          </ListItem>
        ))}
          {/* <ListItem>
            That the Tenant will allow the landlord or their authorised person to visit the property to view the condition at a 24-hours prior notification.
          </ListItem>
          <ListItem>
            That the Tenant will be responsible for maintaining the property in good condition and will hand over the possession of the property to the rightful owner upon termination of the rental agreement.
          </ListItem>
          <ListItem>
            That the residing Tenant will not make any changes, additions, and modifications to the said premises.
          </ListItem>
          <ListItem>
            That either party shall provide a four (04) week written notice to the other for the termination of the rental contract.
          </ListItem>
          <ListItem>
            That on the expiration of the contract duration , this rental agreement can be extended/renewed by a consensual agreement from both sides for any further period, the Tenant will give the vacant possession of the said property.
          </ListItem>
          <ListItem>
            That the Tenant will not be allowed to use the said property for any illegal activity or business.
          </ListItem>
           <ListItem>
            That the tenant will submit the due rent regularly for the tenancy period and shall be responsible for paying water, electricity, maintenance, and other bills. The photocopy of these bills shall be submitted to the landlord in due time.
          </ListItem>
          <ListItem>
            Both the parties have finalised the contract by themselves after satisfaction and inspection of premises, including title documents and legal right of the landlord to rent as well as status and credentials of each other.
          </ListItem> */}
        </OrderedList>

        <Text>
          In witness whereof, the parties named above have ascribed their hands hereto legitimise this agreement at _______ (city name) and the date mentioned
        </Text>
      </VStack>
    </Box>
  );
}