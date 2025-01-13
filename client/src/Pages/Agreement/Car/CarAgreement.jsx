import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Heading,
  Input,
  Text,
  VStack,
  ListItem,
  OrderedList,
  Button,
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/AuthContext';
import { createAgreement } from '../../../Api/Agreement';


export default function CarAgreement({listId,list_Title,list_category, tenant, convoID}) {
//   const location = useLocation();
//     const { tenantName, tenantListing , conversationID } = location.state || {};

const { user } = useAuth();
 const [ownerConfirmed, setOwnerConfirmed] = useState(true);
  const [renterId, setRenterId] = useState("");
  const [formData, setFormData] = useState({
    createdDate: '',
    startDate: '',
    endDate: '',
    advanceRent: '',
    advanceRentMonths: '',
    securityDeposit: '',
    securityDepositMonths: '',
    rentIncreasePercentage: '',

    registrationNum:'',
    make:'',
    carModel:'',
    engineNum:'',
    ChassisNum:'',
    RentAmount:'',
    rentTime:'',
    installments:'',
    crossedChequeAmount:'',
    oilChangeTime:'',
    tuningTime:'',
    meetingOwnerDate:'',
    noticePeriod:'',
    agreementPoints: [
      { id: 1, text: 'The lessee will drive the car personally, holding a valid driving license.' }, 
      { id: 2, text: 'The lessee shall park the car securely at their residence or another guarded location when not in use.' }, 
      { id: 3, text: 'The cars condition shall remain as seen (accident-free, no scratches), and the lessee agrees to return it in the same state.' }, 
      { id: 4, text: 'If the lessee fails to pay the rent on time, the owner has the right to repossess the car.' }, 
      { id: 5, text: 'All traffic fines, penalties, or claims during the lease period shall be borne by the lessee.' }, 
      { id: 6, text: 'The lessee is fully liable for any damage to the car during the lease period and shall repair it at a workshop approved by the owner.' }, 
      
    ]
  });

  const handleCreateAggreement = async () => {
    console.log("Create Aggrement", formData);
    const response = await createAgreement(formData);
    console.log("Response", response.data);
  };

  useEffect(() => {
    if (!list_Title || !list_category || !listId) return;
  }, [list_category, listId, list_Title]);

  //   useEffect(() => {
  //   if (!tenantName || !tenantListing || !conversationID) {
  //     return;
  //   }
  //   // console.log(tenantListing, tenantName , conversationID);
  //   // console.log("COnversationID", conversationID);
  //   // setListingDetail(tenantListing);
  //   // console.log("tentantIDD", tenantName._id);
  //   // setRenterId(tenantName._id);
  //   // setConversationId(conversationID);
  // }, [tenantName, tenantListing , conversationID]);

   const saveAgreement = async (e) => {
    e.preventDefault();

    try {
      
      if (!tenant || !listId) {
        console.log("ids missing");
        return;
      }
      setRenterId(tenant._id);
      console.log("renterID", renterId);

  

      console.log("details are: ", formData);

      const data = await createAgreement({
        aggrementDetail:formData,
        renterId,
        ownerConfirmed,
        listingId: listId,
        conversationID: convoID,
      });

      console.log("responseOFagreement", data);
      // setaggrementFromResponce(data.data.data);
    } catch (error) {
      console.log("errorInAgreement creation is: ", error);
    }
  };

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
        Car Rental Agreement
      </Heading>
      <VStack spacing={4} align="start" fontSize="sm">
        <form  onSubmit={saveAgreement}>
        <Text>
          This rent agreement is being created, on this day of
          <Input
            type="date"
            name="createdDate"
            value={formData.date}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
          date.
        </Text>

        <Text fontWeight="bold">BETWEEN</Text>
        {user && <Text borderBottom="1px solid gray">{user.name}</Text>}
        <Text>Hereinafter known as the "owner" of the one part.</Text>

        <Text fontWeight="bold">AND</Text>
        <Text borderBottom="1px solid gray">
          {tenant.name ||''}
          </Text>
        <Text>Hereinafter known as the 'tenant' of the other part.</Text>

        <Text>
          Whereas the landlord confirms that he is legally competent to rent out
          ______________________________
        </Text>

        <Text fontWeight="bold">
          NOW, THEREFORE, THIS AGREEMENT IS WITNESSETH AS UNDER:-
        </Text>

        <OrderedList spacing={2}>
          <ListItem>
            That the owner has agreed to rent out the car with the following details:
            Registration No. <Input
            type="text"
            name="registrationNum"
            placeholder='LES-15-804'
            value={formData.registrationNum}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />, <br/> Make:
           <Input
            type="text"
             name="make"
            placeholder='Suzuki / Wagon R'
             value={formData.make}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
           , Model: 
           <Input
            type="number"
             name="carModel"
            placeholder='2015'
            value={formData.carModel}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
           
            ,Engine No. 
            <Input
            type="text"
             name="engineNum"
            placeholder='PK50D702015'
             value={formData.engineNum}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />

        ,<br/> Chassis No.
        <Input
            type="text"
            name="ChassisNum"
            placeholder='A1J310PK12458915'
            // value={formData.date}
            onChange={handleChange}
            value={formData.ChassisNum}
            display="inline-block"
            w="40"
            mx={2}
          />.
          </ListItem>
          <ListItem>
            The lease period shall start from
            <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
          and terminate on
          <Input
            type="date"
             name="endDate"
             value={formData.endDate}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />.
          </ListItem>
          <ListItem>
            The lessee shall pay a 
            <Input
            type="text"
             name="rentTime"
            placeholder='monthy/daily'
             value={formData.rentTime}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             rent of Rs. 
            <Input
            type="number"
             name="RentAmount"
            placeholder='30000'
             value={formData.RentAmount}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             in 
             <Input
            type="number"
            name="installments"
            placeholder='2'
             value={formData.installments}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             installments to the owner.
          </ListItem>
          <ListItem>
            The lessee will provide a crossed cheque of Rs.
            <Input
            type="number"
            name="crossedChequeAmount"
            placeholder='30000'
             value={formData.crossedChequeAmount}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          /> as a security deposit, which will be
            returned upon the agreement's termination, subject to deductions for dues or damages.
          </ListItem>
          <ListItem>
            The lessee is responsible for oil changes every
            <Input
            type="number"
             name="oilChangeTime"
            placeholder='5000'
             value={formData.oilChangeTime}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             km and car tuning every
             <Input
            type="number"
             name="tuningTime"
            placeholder='10000'
            value={formData.tuningTime}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
              km at their expense.
          </ListItem>
          
         
          <ListItem>
            The lessee agrees to meet the owner along with the car on the
            <Input
            type="text"
             name="meetingOwnerDate"
            placeholder='20th'
             value={formData.meetingOwnerDate}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             of each month for inspection.
          </ListItem>
          
          <ListItem>
            The lessee shall serve a
            <Input
            type="number"
             name="noticePeriod"
            placeholder='2'
             value={formData.noticePeriod}
            onChange={handleChange}
            display="inline-block"
            w="40"
            mx={2}
          />
             week notice period to terminating the agreement or pay rent for the shortfall
            in the notice period.
          </ListItem>


          {formData.agreementPoints.map((point, index) => (
                    <ListItem key={point.id}>
                      <Text>{point.text}</Text>
                    </ListItem>
                  ))}

          {/* <ListItem>
            The lessee will drive the car personally, holding a valid driving license
          </ListItem>
          <ListItem>
            The lessee shall park the car securely at their residence or another guarded location when not in use.
          </ListItem>
          <ListItem>
            The car's condition shall remain as seen (accident-free, no scratches), and the lessee agrees to return
            it in the same state.
          </ListItem>
          <ListItem>
            If the lessee fails to pay the rent on time, the owner has the right to repossess the car.
          </ListItem>
          <ListItem>
            All traffic fines, penalties, or claims during the lease period shall be borne by the lessee.
          </ListItem>
          <ListItem>
            The lessee is fully liable for any damage to the car during the lease period and shall repair it at a
            workshop approved by the owner.
          </ListItem>
           */}
        </OrderedList>

        <Text>
          In witness whereof, the parties named above have ascribed their hands hereto legitimise this agreement
          at the date mentioned.
        </Text>
        <Button type='submit' bg={'black'} color={'white'}>Create Agreement</Button>
        </form>
      </VStack>
    </Box>
  );
}
