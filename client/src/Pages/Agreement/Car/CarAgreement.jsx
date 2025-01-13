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
} from "@chakra-ui/react";
import { useAuth } from "../../../hooks/AuthContext";
import { createAgreement } from "../../../Api/Agreement";

export default function CarAgreement({
  listId,
  list_Title,
  list_category,
  tenant_name,
}) {
  //   const location = useLocation();
  //     const { tenantName, tenantListing , conversationID } = location.state || {};

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    date: "",
    rentAmount: "",
    startDate: "",
    endDate: "",
    advanceRent: "",
    advanceRentMonths: "",
    securityDeposit: "",
    securityDepositMonths: "",
    rentIncreasePercentage: "",
    // agreementPoints: [
    //   { id: 1, text: 'That the Tenant will allow the landlord or their authorised person to visit the property to view the condition at a 24-hours prior notification.' },
    //   { id: 2, text: 'That the Tenant will be responsible for maintaining the property in good condition and will hand over the possession of the property to the rightful owner upon termination of the rental agreement.' },
    //   { id: 3, text: 'That the residing Tenant will not make any changes, additions, and modifications to the said premises.' },
    //   { id: 4, text: 'That either party shall provide a four (04) week written notice to the other for the termination of the rental contract.' },
    //   { id: 5, text: 'That on the expiration of the contract duration , this rental agreement can be extended/renewed by a consensual agreement from both sides for any further period, the Tenant will give the vacant possession of the said property.' },
    //   { id: 6, text: 'That the Tenant will not be allowed to use the said property for any illegal activity or business.' },
    //   { id: 7, text: 'That the tenant will submit the due rent regularly for the tenancy period and shall be responsible for paying water, electricity, maintenance, and other bills. The photocopy of these bills shall be submitted to the landlord in due time.That the Tenant will not be allowed to use the said property for any illegal activity or business.' },
    //   { id: 8, text: 'Both the parties have finalised the contract by themselves after satisfaction and inspection of premises, including title documents and legal right of the landlord to rent as well as status and credentials of each other.' },
    // ]
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
        {user && <Text borderBottom="1px solid gray">{user.name}</Text>}
        <Text>Hereinafter known as the "owner" of the one part.</Text>

        <Text fontWeight="bold">AND</Text>
        <Text borderBottom="1px solid gray">{tenant_name || ""}</Text>
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
            That the owner has agreed to rent out the car with the following
            details: Registration No.{" "}
            <Input
              type="text"
              // name="date"
              placeholder="LES-15-804"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            , <br /> Make:
            <Input
              type="text"
              // name="date"
              placeholder="Suzuki / Wagon R"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            , Model:
            <Input
              type="number"
              // name="date"
              placeholder="2015"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            ,Engine No.
            <Input
              type="number"
              // name="date"
              placeholder="PK50D702015"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            ,<br /> Chassis No.
            <Input
              type="number"
              // name="date"
              placeholder="A1J310PK12458915"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            .
          </ListItem>
          <ListItem>
            The lease period shall commence from
            <Input
              type="date"
              // name="date"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            and terminate on
            <Input
              type="date"
              // name="date"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            .
          </ListItem>
          <ListItem>
            The lessee shall pay a monthly rent of Rs.
            <Input
              type="number"
              // name="date"
              placeholder="30000"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            in
            <Input
              type="number"
              // name="date"
              placeholder="2"
              // value={formData.date}
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
              // name="date"
              placeholder="30000"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />{" "}
            as a security deposit, which will be returned upon the agreement's
            termination, subject to deductions for dues or damages.
          </ListItem>
          <ListItem>
            The lessee will drive the car personally, holding a valid driving
            license, and for one shift (day) only.
          </ListItem>
          <ListItem>
            The lessee shall park the car securely at their residence or another
            guarded location when not in use.
          </ListItem>
          <ListItem>
            The car's condition shall remain as seen (accident-free, no
            scratches), and the lessee agrees to return it in the same state.
          </ListItem>
          <ListItem>
            The lessee is responsible for oil changes every
            <Input
              type="number"
              // name="date"
              placeholder="5000"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            km and car tuning every
            <Input
              type="number"
              // name="date"
              placeholder="10000"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            km at their expense.
          </ListItem>
          <ListItem>
            The lessee is fully liable for any damage to the car during the
            lease period and shall repair it at a workshop approved by the
            owner.
          </ListItem>
          <ListItem>
            All traffic fines, penalties, or claims during the lease period
            shall be borne by the lessee.
          </ListItem>
          <ListItem>
            The lessee agrees to meet the owner along with the car on the
            <Input
              type="text"
              // name="date"
              placeholder="20th"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            of each month for inspection.
          </ListItem>
          <ListItem>
            If the lessee fails to pay the monthly rent on time, the owner has
            the right to repossess the car.
          </ListItem>
          <ListItem>
            The lessee shall serve a
            <Input
              type="number"
              // name="date"
              placeholder="2"
              // value={formData.date}
              onChange={handleChange}
              display="inline-block"
              w="40"
              mx={2}
            />
            week notice prior to terminating the agreement or pay rent for the
            shortfall in the notice period.
          </ListItem>
        </OrderedList>

        <Text>
          In witness whereof, the parties named above have ascribed their hands
          hereto legitimise this agreement at _______ (city name) and the date
          mentioned.
        </Text>
        <Button bg={"black"} color={"white"} onClick={handleCreateAggreement}>
          Create Agreement
        </Button>
      </VStack>
    </Box>
  );
}
