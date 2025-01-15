// import React, { useEffect, useState } from "react";
// import AgreementTemplate from "./AgreementTemplate";
// import { useParams } from "react-router-dom";
// import { GetAggreementsByID } from "../../Api/Agreement";
// import {
//   Box,
//   Card,
//   Heading,
//   Text,
//   Divider,
//   Stack,
//   Input,
//   Flex,
//   VStack,
//   Image,
//   Button,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   useToast,
// } from "@chakra-ui/react";
// import { useAuth } from "../../hooks/AuthContext";
// import { Circle } from "lucide-react";
// import CarAgreement from "./Car/CarAgreement";

// export default function UpdateAgreement({}) {
//   const { user } = useAuth();

//   const [aggrementDetail, setAggrementDetail] = useState({
//     place: "",
//     timeInDayCount: "",
//     rentAmount: "",
//   });
//   const [ownerConfirmed, setOwnerConfirmed] = useState(false); //done
//   const [renterConfirmed, setRenterConfirmed] = useState(false); //done
//   const [renterDetails, setRenterDetails] = useState(""); // done
//   const [ownerDetail, setOwnerDetail] = useState(""); // done
//   const [listingDetail, setListingDetail] = useState([]); //done
//   //   const [conversationId, setConversationId] = useState("");
//   //   const [listIdToSend, setListIdToSend] = useState("");
//   //   const [aggrementFromResponce , setaggrementFromResponce] = useState([]);

//   const { id } = useParams();

//   useEffect(() => {
//     const fetchSpecificAgreementDetail = async () => {
//       try {
//         if (!user) {
//           return;
//         }
//         if (!id) {
//           return;
//         }

//         console.log("id of agreement", id);
//         const response = await GetAggreementsByID(id);
//         console.log("resp in updateAgreement", response);

//         console.log(
//           "aggr detail",
//           response.data.data.agreementDetailsId.aggrementDetail
//         );
//         const aggrDetail =
//           response.data?.data?.agreementDetailsId?.aggrementDetail;
//         setAggrementDetail({
//           ...aggrementDetail,
//           place: aggrDetail.place,
//           timeInDayCount: aggrDetail.timeInDayCount,
//           rentAmount: aggrDetail.rentAmount,
//         });
//         console.log("renter detail", response.data.data.renterId);
//         setRenterDetails(response.data.data.renterId);
//         setOwnerDetail(response.data.data.ownerId);

//         setOwnerConfirmed(response.data?.data?.ownerConfirmed);
//         setRenterConfirmed(response.data?.data?.renterConfirmed);

//         console.log("listing", response.data?.data?.listingId);
//         setListingDetail(response.data?.data?.listingId);
//       } catch (error) {
//         console.log("errr", error);
//       }
//     };
//     fetchSpecificAgreementDetail();
//   }, [id, user]);

//   const OwnerConfirmed = async () => {
//     if (ownerConfirmed) {
//       setOwnerConfirmed(false);
//     } else {
//       setOwnerConfirmed(true);
//     }
//   };
//   const RenterConfirmed = async () => {
//     if (renterConfirmed) {
//       setRenterConfirmed(false);
//     } else {
//       setRenterConfirmed(true);
//     }
//   };

//   return (
//     // <>
//     // nn
//     // </>

//     <div>
     
//     </div>
//   );
// }
